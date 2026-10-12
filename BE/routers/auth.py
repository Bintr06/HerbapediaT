import io
import logging
import os
import secrets
from datetime import datetime, timedelta, timezone

from fastapi import APIRouter, Depends, File, UploadFile, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from google.oauth2 import id_token
from google.auth.transport import requests as google_requests
from jose import JWTError, jwt
import bcrypt
import cloudinary
from dotenv import load_dotenv
from pydantic import BaseModel, Field, field_validator
from sqlalchemy.orm import Session

from cloudinary_service import delete_image, upload_image
from email_service import send_password_reset_otp
from database import (
    CommunityComment,
    CommunityLike,
    CommunityPost,
    Herb,
    HerbReview,
    Notification,
    PasswordReset,
    PredictionHistory,
    SessionLocal,
    User,
)

load_dotenv()
logger = logging.getLogger(__name__)

router = APIRouter(prefix="/auth", tags=["Authentication"])
security = HTTPBearer(auto_error=False)

JWT_ALGORITHM = "HS256"
JWT_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "60"))
JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY")
GOOGLE_CLIENT_ID = (os.getenv("GOOGLE_CLIENT_ID") or "").strip().strip('"').strip("'")
if not JWT_SECRET_KEY:
    raise RuntimeError("JWT_SECRET_KEY must be configured in the environment")


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


class Credentials(BaseModel):
    username: str = Field(min_length=3, max_length=50)
    password: str = Field(min_length=8, max_length=72)

    @field_validator("username")
    @classmethod
    def normalize_username(cls, value: str) -> str:
        value = value.strip()
        if not value:
            raise ValueError("Tên đăng nhập không được để trống")
        return value


class RegisterCredentials(Credentials):
    display_name: str = Field(min_length=1, max_length=100)

    @field_validator("display_name")
    @classmethod
    def normalize_display_name(cls, value: str) -> str:
        value = value.strip()
        if not value:
            raise ValueError("Họ và tên không được để trống")
        return value


class ProfileUpdate(BaseModel):
    display_name: str = Field(min_length=1, max_length=100)
    phone: str = Field(default="", max_length=20)

    @field_validator("display_name", "phone")
    @classmethod
    def normalize_profile_value(cls, value: str) -> str:
        return value.strip()


class TokenResponse(BaseModel):
    access_token: str
    token_type: str
    expires_in: int
    username: str
    role: str


class GoogleCredential(BaseModel):
    credential: str = Field(min_length=1)


class PasswordChange(BaseModel):
    current_password: str = Field(min_length=1, max_length=72)
    new_password: str = Field(min_length=8, max_length=72)


class ForgotPasswordRequest(BaseModel):
    email: str = Field(min_length=3, max_length=100)

    @field_validator("email")
    @classmethod
    def normalize_email(cls, value: str) -> str:
        value = value.strip().lower()
        if not value or "@" not in value:
            raise ValueError("Email không hợp lệ.")
        return value


class VerifyOtpRequest(BaseModel):
    email: str = Field(min_length=3, max_length=100)
    otp_code: str = Field(min_length=6, max_length=10)

    @field_validator("email")
    @classmethod
    def normalize_email(cls, value: str) -> str:
        return value.strip().lower()

    @field_validator("otp_code")
    @classmethod
    def normalize_otp(cls, value: str) -> str:
        return value.strip()


class ResetPasswordRequest(BaseModel):
    email: str = Field(min_length=3, max_length=100)
    otp_code: str = Field(min_length=6, max_length=10)
    new_password: str = Field(min_length=8, max_length=72)

    @field_validator("email")
    @classmethod
    def normalize_email(cls, value: str) -> str:
        return value.strip().lower()

    @field_validator("otp_code")
    @classmethod
    def normalize_otp(cls, value: str) -> str:
        return value.strip()



class AdminUserCreate(BaseModel):
    username: str = Field(min_length=3, max_length=50)
    password: str = Field(min_length=8, max_length=72)
    display_name: str = Field(min_length=1, max_length=100)
    phone: str = Field(default="", max_length=20)
    role: str = Field(default="user")

    @field_validator("username", "display_name")
    @classmethod
    def normalize_fields(cls, value: str) -> str:
        value = value.strip()
        if not value:
            raise ValueError("Trường thông tin không được để trống")
        return value

    @field_validator("role")
    @classmethod
    def validate_role(cls, value: str) -> str:
        value = value.strip().lower()
        if value not in {"user", "admin"}:
            raise ValueError("Vai trò chỉ có thể là 'user' hoặc 'admin'")
        return value


class AdminUserUpdate(BaseModel):
    display_name: str | None = Field(default=None, max_length=100)
    phone: str | None = Field(default=None, max_length=20)
    role: str | None = None
    is_active: bool | None = None
    new_password: str | None = Field(default=None, max_length=72)

    @field_validator("role")
    @classmethod
    def validate_role(cls, value: str | None) -> str | None:
        if value is not None:
            value = value.strip().lower()
            if value not in {"user", "admin"}:
                raise ValueError("Vai trò chỉ có thể là 'user' hoặc 'admin'")
        return value


def _history_herb_slug(item: PredictionHistory, db: Session) -> str | None:
    predicted = (item.predicted_class or "").strip().lower()
    if not predicted:
        return None
    predicted_base = predicted.split("(", 1)[0].strip()
    herbs = db.query(Herb).all()
    for herb in herbs:
        candidates = (
            herb.slug,
            herb.dataset_name,
            herb.name_vi,
        )
        for candidate in candidates:
            value = (candidate or "").strip().lower()
            if value and (predicted_base == value or predicted_base in value or value in predicted_base):
                return herb.slug
    return None


def history_response(item: PredictionHistory, db: Session) -> dict:
    return {
        "id": item.id,
        "image_url": item.image_url,
        "predicted_class": item.predicted_class,
        "herb_slug": _history_herb_slug(item, db),
        "confidence": item.confidence,
        "created_at": item.created_at,
    }


def hash_password(password: str) -> str:
    return bcrypt.hashpw(
        password.encode("utf-8"),
        bcrypt.gensalt(),
    ).decode("utf-8")


def verify_password(password: str, password_hash: str) -> bool:
    try:
        return bcrypt.checkpw(
            password.encode("utf-8"),
            password_hash.encode("utf-8"),
        )
    except (ValueError, TypeError):
        return False


def create_access_token(username: str) -> tuple[str, int]:
    expires_in = JWT_EXPIRE_MINUTES * 60
    expires_at = datetime.now(timezone.utc) + timedelta(seconds=expires_in)
    payload = {"sub": username, "exp": expires_at}
    token = jwt.encode(payload, JWT_SECRET_KEY, algorithm=JWT_ALGORITHM)
    return token, expires_in


def token_response(user: User) -> dict[str, str | int]:
    access_token, expires_in = create_access_token(user.username)
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "expires_in": expires_in,
        "username": user.username,
        "role": user.role or "user",
    }


def get_current_user(
    credentials: HTTPAuthorizationCredentials | None = Depends(security),
    db: Session = Depends(get_db),
) -> User:
    unauthorized = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Thông tin xác thực không hợp lệ hoặc đã hết hạn",
        headers={"WWW-Authenticate": "Bearer"},
    )
    if credentials is None or credentials.scheme.lower() != "bearer":
        raise unauthorized

    try:
        payload = jwt.decode(
            credentials.credentials,
            JWT_SECRET_KEY,
            algorithms=[JWT_ALGORITHM],
        )
        username = payload.get("sub")
        if not isinstance(username, str) or not username:
            raise unauthorized
    except JWTError as exc:
        raise unauthorized from exc

    db_user = db.query(User).filter(User.username == username).first()
    if db_user is None:
        raise unauthorized
    if getattr(db_user, "is_active", True) is False:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Tài khoản đã bị khóa bởi quản trị viên.",
        )
    configured_admins = {
        item.strip().lower()
        for item in os.getenv("ADMIN_USERNAMES", "").split(",")
        if item.strip()
    }
    if db_user.username.lower() in configured_admins and db_user.role != "admin":
        db_user.role = "admin"
        db.commit()
    return db_user


def get_admin_user(current_user: User = Depends(get_current_user)) -> User:
    if current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Bạn không có quyền quản trị.",
        )
    return current_user


@router.post("/register", status_code=status.HTTP_201_CREATED)
def register_user(user: RegisterCredentials, db: Session = Depends(get_db)):
    existing_user = db.query(User).filter(User.username == user.username).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Tên đăng nhập đã tồn tại!",
        )

    new_user = User(
        username=user.username,
        hashed_password=hash_password(user.password),
        display_name=user.display_name,
        auth_provider="password",
        role="user",
        created_at=datetime.now(timezone.utc),
        updated_at=datetime.now(timezone.utc),
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return {"message": "Đăng ký tài khoản thành công!", "username": new_user.username}


@router.post("/login", response_model=TokenResponse)
def login_user(user: Credentials, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.username == user.username).first()
    if db_user is None or not verify_password(
        user.password,
        db_user.hashed_password,
    ):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Tài khoản hoặc mật khẩu không chính xác!",
            headers={"WWW-Authenticate": "Bearer"},
        )
    if getattr(db_user, "is_active", True) is False:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Tài khoản đã bị khóa bởi quản trị viên.",
        )

    return token_response(db_user)


@router.post("/google", response_model=TokenResponse)
def login_with_google(
    google_credential: GoogleCredential,
    db: Session = Depends(get_db),
):
    if not GOOGLE_CLIENT_ID:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Đăng nhập Google chưa được cấu hình trên máy chủ.",
        )

    try:
        google_user = id_token.verify_oauth2_token(
            google_credential.credential,
            google_requests.Request(),
            audience=GOOGLE_CLIENT_ID,
            clock_skew_in_seconds=60,
        )
    except ValueError as exc:
        logger.error(f"[GOOGLE AUTH ERROR] Xác thực Google ID Token thất bại: {exc}", exc_info=True)
        print(f"[GOOGLE AUTH ERROR] Xác thực Google ID Token thất bại: {exc}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Xác thực Google thất bại: {str(exc)}",
        ) from exc
    except Exception as exc:
        logger.error(f"[GOOGLE AUTH ERROR] Lỗi không xác định khi verify Google: {exc}", exc_info=True)
        print(f"[GOOGLE AUTH ERROR] Lỗi không xác định khi verify Google: {exc}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Lỗi xác thực Google: {str(exc)}",
        ) from exc

    email = google_user.get("email")
    if not isinstance(email, str) or not google_user.get("email_verified"):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Tài khoản Google chưa xác minh email.",
        )

    username = email.strip().lower()
    db_user = db.query(User).filter(User.username == username).first()
    if db_user is None:
        db_user = User(
            username=username,
            hashed_password=hash_password(secrets.token_urlsafe(32)),
            display_name=google_user.get("name") or username.split("@")[0],
            avatar_url=google_user.get("picture"),
            auth_provider="google",
            role="user",
            is_active=True,
            created_at=datetime.now(timezone.utc),
            updated_at=datetime.now(timezone.utc),
        )
        db.add(db_user)
        db.commit()
        db.refresh(db_user)
    elif getattr(db_user, "is_active", True) is False:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Tài khoản đã bị khóa bởi quản trị viên.",
        )

    return token_response(db_user)


@router.get("/me")
def get_me(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    history_count = db.query(PredictionHistory).filter(
        PredictionHistory.user_id == current_user.id
    ).count()
    species_count = db.query(PredictionHistory.predicted_class).filter(
        PredictionHistory.user_id == current_user.id
    ).distinct().count()
    display_name = (current_user.display_name or "").strip()
    if not display_name or display_name.lower() == current_user.username.lower():
        display_name = ""
    return {
        "id": current_user.id,
        "username": current_user.username,
        "display_name": display_name,
        "phone": current_user.phone or "",
        "avatar_url": current_user.avatar_url,
        "auth_provider": current_user.auth_provider or "password",
        "role": current_user.role or "user",
        "created_at": current_user.created_at,
        "history_count": history_count,
        "species_count": species_count,
    }


@router.post("/me/avatar")
async def update_avatar(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    if file.content_type not in {"image/jpeg", "image/png", "image/webp"}:
        raise HTTPException(status_code=415, detail="Avatar phải là JPEG, PNG hoặc WEBP.")
    image_data = await file.read()
    if len(image_data) > 5 * 1024 * 1024:
        raise HTTPException(status_code=413, detail="Avatar không được vượt quá 5 MB.")
    try:
        result = upload_image(
            io.BytesIO(image_data),
            f"herbapedia/users/{current_user.id}/avatar",
        )
    except (cloudinary.exceptions.Error, RuntimeError) as exc:
        raise HTTPException(status_code=503, detail="Không thể lưu avatar lên Cloudinary.") from exc
    old_public_id = current_user.avatar_public_id
    current_user.avatar_url = result["url"]
    current_user.avatar_public_id = result["public_id"]
    current_user.updated_at = datetime.now(timezone.utc)
    db.commit()
    if old_public_id:
        try:
            delete_image(old_public_id)
        except (cloudinary.exceptions.Error, RuntimeError):
            logger.warning("Không thể xóa avatar cũ trên Cloudinary.", exc_info=True)
    return get_me(current_user, db)


@router.get("/history")
def get_history(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    items = (
        db.query(PredictionHistory)
        .filter(PredictionHistory.user_id == current_user.id)
        .order_by(PredictionHistory.created_at.desc())
        .all()
    )
    return [history_response(item, db) for item in items]


@router.delete("/history/{history_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_history(
    history_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    item = (
        db.query(PredictionHistory)
        .filter(
            PredictionHistory.id == history_id,
            PredictionHistory.user_id == current_user.id,
        )
        .first()
    )
    if item is None:
        raise HTTPException(status_code=404, detail="Không tìm thấy lịch sử nhận diện.")
    public_id = item.image_public_id
    db.delete(item)
    db.commit()
    if public_id:
        try:
            delete_image(public_id)
        except (cloudinary.exceptions.Error, RuntimeError):
            logger.warning("Không thể xóa ảnh lịch sử trên Cloudinary.", exc_info=True)


@router.put("/me")
def update_me(
    profile: ProfileUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    current_user.display_name = profile.display_name
    current_user.phone = profile.phone or None
    current_user.updated_at = datetime.now(timezone.utc)
    db.commit()
    db.refresh(current_user)
    return get_me(current_user, db)


@router.post("/change-password")
def change_password(
    passwords: PasswordChange,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    if not verify_password(
        passwords.current_password,
        current_user.hashed_password,
    ):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Mật khẩu hiện tại không chính xác.",
        )

    current_user.hashed_password = hash_password(passwords.new_password)
    current_user.updated_at = datetime.now(timezone.utc)
    db.commit()
    return {"message": "Đổi mật khẩu thành công."}


@router.post("/forgot-password/send-otp")
def forgot_password_send_otp(
    payload: ForgotPasswordRequest,
    db: Session = Depends(get_db),
):
    email = payload.email.lower()
    user = db.query(User).filter(User.username.ilike(email)).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Không tìm thấy tài khoản với địa chỉ email này.",
        )
    if user.is_active is False:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Tài khoản đã bị khóa. Vui lòng liên hệ quản trị viên.",
        )

    # Invalidate old unused OTPs for this email
    db.query(PasswordReset).filter(
        PasswordReset.email.ilike(email),
        PasswordReset.is_used == False,
    ).update({"is_used": True}, synchronize_session=False)

    # Generate 6-digit OTP code
    otp_code = f"{secrets.randbelow(900000) + 100000:06d}"
    now_naive = datetime.now(timezone.utc).replace(tzinfo=None)
    expires_at = now_naive + timedelta(minutes=15)

    reset_entry = PasswordReset(
        email=email,
        otp_code=otp_code,
        expires_at=expires_at,
        is_used=False,
        created_at=now_naive,
    )
    db.add(reset_entry)
    db.commit()

    # Attempt sending OTP email via SMTP
    sent, sent_msg = send_password_reset_otp(
        to_email=email,
        otp_code=otp_code,
        display_name=user.display_name,
    )

    response = {
        "message": "Mã xác thực đã được gửi về email của bạn." if sent else "Mã xác thực khôi phục mật khẩu đã được tạo.",
        "email": email,
        "email_sent": sent,
        "expires_in_minutes": 15,
    }
    if not sent:
        response["dev_otp"] = otp_code
        response["note"] = "Chế độ thử nghiệm (chưa cấu hình SMTP): Mã OTP được cung cấp trực tiếp để kiểm thử."

    return response


@router.post("/forgot-password/verify-otp")
def forgot_password_verify_otp(
    payload: VerifyOtpRequest,
    db: Session = Depends(get_db),
):
    email = payload.email.lower()
    now_naive = datetime.now(timezone.utc).replace(tzinfo=None)
    record = (
        db.query(PasswordReset)
        .filter(
            PasswordReset.email.ilike(email),
            PasswordReset.otp_code == payload.otp_code,
            PasswordReset.is_used == False,
            PasswordReset.expires_at >= now_naive,
        )
        .order_by(PasswordReset.created_at.desc())
        .first()
    )
    if not record:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Mã xác thực OTP không chính xác hoặc đã hết hạn.",
        )
    return {"valid": True, "message": "Mã xác thực hợp lệ."}


@router.post("/forgot-password/reset-password")
def forgot_password_reset_password(
    payload: ResetPasswordRequest,
    db: Session = Depends(get_db),
):
    email = payload.email.lower()
    now_naive = datetime.now(timezone.utc).replace(tzinfo=None)

    user = db.query(User).filter(User.username.ilike(email)).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Không tìm thấy tài khoản với địa chỉ email này.",
        )
    if user.is_active is False:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Tài khoản đã bị khóa. Vui lòng liên hệ quản trị viên.",
        )

    record = (
        db.query(PasswordReset)
        .filter(
            PasswordReset.email.ilike(email),
            PasswordReset.otp_code == payload.otp_code,
            PasswordReset.is_used == False,
            PasswordReset.expires_at >= now_naive,
        )
        .order_by(PasswordReset.created_at.desc())
        .first()
    )
    if not record:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Mã xác thực OTP không chính xác hoặc đã hết hạn.",
        )

    if len(payload.new_password) < 8:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Mật khẩu mới phải có ít nhất 8 ký tự.",
        )

    user.hashed_password = hash_password(payload.new_password)
    user.updated_at = now_naive
    record.is_used = True
    db.commit()

    return {"message": "Đặt lại mật khẩu thành công! Bạn có thể đăng nhập bằng mật khẩu mới."}



def admin_user_response(user: User, db: Session) -> dict:
    history_count = db.query(PredictionHistory).filter(
        PredictionHistory.user_id == user.id
    ).count()
    return {
        "id": user.id,
        "username": user.username,
        "display_name": (user.display_name or "").strip(),
        "phone": user.phone or "",
        "avatar_url": user.avatar_url,
        "auth_provider": user.auth_provider or "password",
        "role": user.role or "user",
        "is_active": getattr(user, "is_active", True) is not False,
        "created_at": user.created_at,
        "updated_at": user.updated_at,
        "history_count": history_count,
    }


@router.get("/users")
def list_admin_users(
    q: str | None = None,
    role: str | None = None,
    current_admin: User = Depends(get_admin_user),
    db: Session = Depends(get_db),
):
    del current_admin
    query = db.query(User)
    if q and q.strip():
        kw = f"%{q.strip()}%"
        query = query.filter(
            (User.username.ilike(kw))
            | (User.display_name.ilike(kw))
            | (User.phone.ilike(kw))
        )
    if role and role.strip() and role.strip() != "all":
        query = query.filter(User.role == role.strip().lower())
    users = query.order_by(User.created_at.desc()).all()
    return [admin_user_response(u, db) for u in users]


@router.post("/users", status_code=status.HTTP_201_CREATED)
def create_admin_user(
    payload: AdminUserCreate,
    current_admin: User = Depends(get_admin_user),
    db: Session = Depends(get_db),
):
    del current_admin
    existing = db.query(User).filter(User.username == payload.username).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Tên đăng nhập đã tồn tại trong hệ thống.",
        )
    now = datetime.now(timezone.utc)
    new_user = User(
        username=payload.username,
        hashed_password=hash_password(payload.password),
        display_name=payload.display_name,
        phone=payload.phone or None,
        role=payload.role,
        is_active=True,
        auth_provider="password",
        created_at=now,
        updated_at=now,
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return admin_user_response(new_user, db)


@router.put("/users/{user_id}")
def update_admin_user(
    user_id: int,
    payload: AdminUserUpdate,
    current_admin: User = Depends(get_admin_user),
    db: Session = Depends(get_db),
):
    target_user = db.query(User).filter(User.id == user_id).first()
    if target_user is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Không tìm thấy người dùng.",
        )
    if target_user.id == current_admin.id:
        if payload.role and payload.role != "admin":
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Bạn không thể tự hạ quyền quản trị của chính mình.",
            )
        if payload.is_active is False:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Bạn không thể tự khóa tài khoản của chính mình.",
            )

    if payload.role is not None:
        target_user.role = payload.role
    if payload.is_active is not None:
        target_user.is_active = payload.is_active
    if payload.display_name is not None:
        target_user.display_name = payload.display_name.strip()
    if payload.phone is not None:
        target_user.phone = payload.phone.strip() or None
    if payload.new_password is not None and len(payload.new_password.strip()) >= 8:
        target_user.hashed_password = hash_password(payload.new_password.strip())

    target_user.updated_at = datetime.now(timezone.utc)
    db.commit()
    db.refresh(target_user)
    return admin_user_response(target_user, db)


@router.delete("/users/{user_id}")
def delete_admin_user(
    user_id: int,
    current_admin: User = Depends(get_admin_user),
    db: Session = Depends(get_db),
):
    if user_id == current_admin.id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Bạn không thể tự xóa tài khoản của chính mình.",
        )
    target_user = db.query(User).filter(User.id == user_id).first()
    if target_user is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Không tìm thấy người dùng.",
        )

    histories = db.query(PredictionHistory).filter(PredictionHistory.user_id == target_user.id).all()
    for h in histories:
        if h.image_public_id:
            try:
                delete_image(h.image_public_id)
            except Exception:
                pass
        db.delete(h)

    db.query(HerbReview).filter(HerbReview.user_id == target_user.id).delete()
    db.query(CommunityLike).filter(CommunityLike.user_id == target_user.id).delete()
    db.query(CommunityComment).filter(CommunityComment.user_id == target_user.id).delete()
    db.query(Notification).filter(
        (Notification.recipient_user_id == target_user.id) | (Notification.actor_user_id == target_user.id)
    ).delete()

    user_posts = db.query(CommunityPost).filter(CommunityPost.user_id == target_user.id).all()
    for post in user_posts:
        db.query(CommunityComment).filter(CommunityComment.post_id == post.id).delete()
        db.query(CommunityLike).filter(CommunityLike.post_id == post.id).delete()
        db.query(Notification).filter(Notification.post_id == post.id).delete()
        db.delete(post)

    if target_user.avatar_public_id:
        try:
            delete_image(target_user.avatar_public_id)
        except Exception:
            pass

    db.delete(target_user)
    db.commit()
    return {"message": "Đã xóa người dùng thành công."}
