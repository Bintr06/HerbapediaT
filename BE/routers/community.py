import io
from datetime import datetime, timezone

import cloudinary
from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile, status
from fastapi.security import HTTPAuthorizationCredentials
from jose import JWTError, jwt
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session

from cloudinary_service import upload_image
from database import CommunityComment, CommunityLike, CommunityPost, Notification, SessionLocal, User
from routers.auth import JWT_ALGORITHM, JWT_SECRET_KEY, get_current_user, security

router = APIRouter(prefix="/community", tags=["Community"])


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def get_optional_current_user(
    credentials: HTTPAuthorizationCredentials | None = Depends(security),
    db: Session = Depends(get_db),
) -> User | None:
    if credentials is None or credentials.scheme.lower() != "bearer":
        return None
    try:
        payload = jwt.decode(
            credentials.credentials,
            JWT_SECRET_KEY,
            algorithms=[JWT_ALGORITHM],
        )
    except JWTError:
        return None
    username = payload.get("sub")
    if not isinstance(username, str) or not username:
        return None
    return db.query(User).filter(User.username == username).first()


class CommentCreate(BaseModel):
    content: str = Field(min_length=1, max_length=2000)
    parent_comment_id: int | None = None


class PostUpdate(BaseModel):
    title: str = Field(min_length=1, max_length=255)
    content: str = Field(min_length=1, max_length=10000)


def post_response(
    post: CommunityPost,
    db: Session,
    current_user_id: int | None = None,
    is_admin: bool = False,
) -> dict:
    like_count = db.query(CommunityLike).filter(CommunityLike.post_id == post.id).count()
    comment_count = db.query(CommunityComment).filter(CommunityComment.post_id == post.id).count()
    liked = current_user_id is not None and db.query(CommunityLike).filter(
        CommunityLike.post_id == post.id,
        CommunityLike.user_id == current_user_id,
    ).first() is not None
    author = db.query(User).filter(User.id == post.user_id).first()
    is_author = current_user_id is not None and post.user_id == current_user_id
    can_delete = is_author or is_admin
    can_edit = is_author or is_admin
    return {
        "id": post.id,
        "title": post.title,
        "content": post.content,
        "post_type": post.post_type,
        "image_url": post.image_url,
        "created_at": post.created_at,
        "author": {
            "id": author.id if author else None,
            "display_name": (author.display_name or author.username) if author else "Người dùng",
            "avatar_url": author.avatar_url if author else None,
            "role": "member",
        },
        "like_count": like_count,
        "comment_count": comment_count,
        "liked": liked,
        "can_delete": can_delete,
        "can_edit": can_edit,
    }


def add_notification(
    db: Session,
    recipient_user_id: int,
    actor_user_id: int,
    notification_type: str,
    message: str,
    post_id: int | None = None,
    comment_id: int | None = None,
) -> None:
    if recipient_user_id == actor_user_id:
        return
    db.add(Notification(
        recipient_user_id=recipient_user_id,
        actor_user_id=actor_user_id,
        post_id=post_id,
        comment_id=comment_id,
        notification_type=notification_type,
        message=message,
        is_read=False,
        created_at=datetime.now(timezone.utc),
    ))


@router.get("/users/me/profile")
def get_my_community_profile(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    post_count = db.query(CommunityPost).filter(CommunityPost.user_id == current_user.id).count()
    user_post_ids = [p.id for p in db.query(CommunityPost.id).filter(CommunityPost.user_id == current_user.id).all()]
    total_likes = (
        db.query(CommunityLike).filter(CommunityLike.post_id.in_(user_post_ids)).count()
        if user_post_ids
        else 0
    )
    return {
        "id": current_user.id,
        "username": current_user.username,
        "display_name": current_user.display_name or current_user.username,
        "avatar_url": current_user.avatar_url,
        "role": "member",
        "created_at": current_user.created_at,
        "post_count": post_count,
        "total_likes": total_likes,
        "is_owner": True,
    }


@router.get("/users/{user_id}/profile")
def get_user_community_profile(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: User | None = Depends(get_optional_current_user),
):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="Không tìm thấy người dùng.")

    post_count = db.query(CommunityPost).filter(CommunityPost.user_id == user.id).count()
    user_post_ids = [p.id for p in db.query(CommunityPost.id).filter(CommunityPost.user_id == user.id).all()]
    total_likes = (
        db.query(CommunityLike).filter(CommunityLike.post_id.in_(user_post_ids)).count()
        if user_post_ids
        else 0
    )
    is_owner = current_user is not None and current_user.id == user.id

    return {
        "id": user.id,
        "username": user.username,
        "display_name": user.display_name or user.username,
        "avatar_url": user.avatar_url,
        "role": "member",
        "created_at": user.created_at,
        "post_count": post_count,
        "total_likes": total_likes,
        "is_owner": is_owner,
    }


@router.get("/posts")
def list_posts(
    user_id: int | None = None,
    db: Session = Depends(get_db),
    current_user: User | None = Depends(get_optional_current_user),
):
    query = db.query(CommunityPost)
    if user_id is not None:
        query = query.filter(CommunityPost.user_id == user_id)
    posts = query.order_by(CommunityPost.created_at.desc()).limit(100).all()
    viewer_id = current_user.id if current_user else None
    is_admin = current_user is not None and current_user.role == "admin"
    return [post_response(post, db, viewer_id, is_admin) for post in posts]


@router.post("/posts", status_code=status.HTTP_201_CREATED)
async def create_post(
    title: str = Form(..., min_length=1, max_length=255),
    content: str = Form(..., min_length=1, max_length=10000),
    post_type: str = Form("general", max_length=30),
    file: UploadFile | None = File(None),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    title = title.strip()
    content = content.strip()
    post_type = post_type.strip() or "general"
    if not title or not content:
        raise HTTPException(status_code=422, detail="Tiêu đề và nội dung không được để trống.")

    image_url = None
    if file is not None:
        if file.content_type not in {"image/jpeg", "image/png", "image/webp"}:
            raise HTTPException(status_code=415, detail="Ảnh bài viết phải là JPEG, PNG hoặc WEBP.")
        image_data = await file.read()
        if len(image_data) > 10 * 1024 * 1024:
            raise HTTPException(status_code=413, detail="Ảnh bài viết không được vượt quá 10 MB.")
        try:
            result = upload_image(
                io.BytesIO(image_data),
                f"herbapedia/users/{current_user.id}/community",
            )
            image_url = result["url"]
        except (cloudinary.exceptions.Error, RuntimeError) as exc:
            raise HTTPException(status_code=503, detail="Không thể lưu ảnh bài viết.") from exc

    post = CommunityPost(
        user_id=current_user.id,
        title=title,
        content=content,
        post_type=post_type,
        image_url=image_url,
        created_at=datetime.now(timezone.utc),
    )
    db.add(post)
    db.commit()
    db.refresh(post)
    return post_response(post, db, current_user.id, current_user.role == "admin")


@router.put("/posts/{post_id}")
def update_post(
    post_id: int,
    payload: PostUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    post = db.query(CommunityPost).filter(CommunityPost.id == post_id).first()
    if post is None:
        raise HTTPException(status_code=404, detail="Không tìm thấy bài viết.")
    if post.user_id != current_user.id and current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Bạn không có quyền chỉnh sửa bài viết này.")
    title = payload.title.strip()
    content = payload.content.strip()
    if not title or not content:
        raise HTTPException(status_code=422, detail="Tiêu đề và nội dung không được để trống.")
    post.title = title
    post.content = content
    db.commit()
    db.refresh(post)
    return post_response(post, db, current_user.id, current_user.role == "admin")


@router.delete("/posts/{post_id}")
def delete_post(
    post_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    post = db.query(CommunityPost).filter(CommunityPost.id == post_id).first()
    if post is None:
        raise HTTPException(status_code=404, detail="Không tìm thấy bài viết.")
    if post.user_id != current_user.id and current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Bạn không có quyền xóa bài viết này.")
    db.query(CommunityLike).filter(CommunityLike.post_id == post_id).delete(synchronize_session=False)
    db.query(CommunityComment).filter(CommunityComment.post_id == post_id).delete(synchronize_session=False)
    db.query(Notification).filter(Notification.post_id == post_id).delete(synchronize_session=False)
    db.delete(post)
    db.commit()
    return {"success": True, "message": "Đã xóa bài viết thành công."}


@router.post("/posts/{post_id}/like")
def toggle_like(
    post_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    post = db.query(CommunityPost).filter(CommunityPost.id == post_id).first()
    if post is None:
        raise HTTPException(status_code=404, detail="Không tìm thấy bài viết.")
    like = db.query(CommunityLike).filter(
        CommunityLike.post_id == post_id,
        CommunityLike.user_id == current_user.id,
    ).first()
    if like:
        db.delete(like)
        liked = False
    else:
        db.add(CommunityLike(
            post_id=post_id,
            user_id=current_user.id,
            created_at=datetime.now(timezone.utc),
        ))
        liked = True
        if liked:
            post_author = db.query(User).filter(User.id == post.user_id).first()
            add_notification(
                db,
                post_author.id,
                current_user.id,
                "like",
                "đã thích bài viết của bạn.",
                post_id=post.id,
            )
    db.commit()
    count = db.query(CommunityLike).filter(CommunityLike.post_id == post_id).count()
    return {"liked": liked, "like_count": count}


@router.get("/posts/{post_id}/comments")
def list_comments(
    post_id: int,
    db: Session = Depends(get_db),
    current_user: User | None = Depends(get_optional_current_user),
):
    comments = db.query(CommunityComment).filter(
        CommunityComment.post_id == post_id,
    ).order_by(CommunityComment.created_at.asc()).all()
    post = db.query(CommunityPost).filter(CommunityPost.id == post_id).first()
    viewer_id = current_user.id if current_user else None
    is_admin = current_user is not None and current_user.role == "admin"
    return [
        {
            "id": comment.id,
            "parent_comment_id": comment.parent_comment_id,
            "content": comment.content,
            "created_at": comment.created_at,
            "author": {
                "id": user.id if user else None,
                "display_name": (user.display_name or user.username) if user else "Người dùng",
                "avatar_url": user.avatar_url if user else None,
            },
            "can_delete": viewer_id is not None and (
                comment.user_id == viewer_id or
                (post and post.user_id == viewer_id) or
                is_admin
            ),
        }
        for comment in comments
        for user in [db.query(User).filter(User.id == comment.user_id).first()]
    ]


@router.delete("/comments/{comment_id}")
def delete_comment(
    comment_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    comment = db.query(CommunityComment).filter(CommunityComment.id == comment_id).first()
    if comment is None:
        raise HTTPException(status_code=404, detail="Không tìm thấy bình luận.")
    post = db.query(CommunityPost).filter(CommunityPost.id == comment.post_id).first()
    if comment.user_id != current_user.id and (not post or post.user_id != current_user.id) and current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Bạn không có quyền xóa bình luận này.")
    db.query(CommunityComment).filter(CommunityComment.parent_comment_id == comment_id).delete(synchronize_session=False)
    db.query(Notification).filter(Notification.comment_id == comment_id).delete(synchronize_session=False)
    db.delete(comment)
    db.commit()
    return {"success": True, "message": "Đã xóa bình luận thành công."}


@router.post("/posts/{post_id}/comments", status_code=status.HTTP_201_CREATED)
def create_comment(
    post_id: int,
    payload: CommentCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    post = db.query(CommunityPost).filter(CommunityPost.id == post_id).first()
    if post is None:
        raise HTTPException(status_code=404, detail="Không tìm thấy bài viết.")
    content = payload.content.strip()
    if not content:
        raise HTTPException(status_code=422, detail="Bình luận không được để trống.")
    parent_comment = None
    if payload.parent_comment_id is not None:
        parent_comment = db.query(CommunityComment).filter(
            CommunityComment.id == payload.parent_comment_id,
            CommunityComment.post_id == post_id,
        ).first()
        if parent_comment is None:
            raise HTTPException(status_code=404, detail="Không tìm thấy bình luận cần trả lời.")
    comment = CommunityComment(
        post_id=post_id,
        user_id=current_user.id,
        parent_comment_id=payload.parent_comment_id,
        content=content,
        created_at=datetime.now(timezone.utc),
    )
    db.add(comment)
    db.flush()
    recipient_id = parent_comment.user_id if parent_comment else post.user_id
    add_notification(
        db,
        recipient_id,
        current_user.id,
        "reply" if parent_comment else "comment",
        "đã trả lời bình luận của bạn." if parent_comment else "đã bình luận bài viết của bạn.",
        post_id=post_id,
        comment_id=comment.id,
    )
    db.commit()
    db.refresh(comment)
    return {
        "id": comment.id,
        "parent_comment_id": comment.parent_comment_id,
        "content": comment.content,
        "created_at": comment.created_at,
        "author": {
            "id": current_user.id,
            "display_name": current_user.display_name or current_user.username,
            "avatar_url": current_user.avatar_url,
        },
    }


@router.get("/notifications")
def list_notifications(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    notifications = db.query(Notification).filter(
        Notification.recipient_user_id == current_user.id,
    ).order_by(Notification.created_at.desc()).limit(30).all()
    unread_count = db.query(Notification).filter(
        Notification.recipient_user_id == current_user.id,
        Notification.is_read.is_(False),
    ).count()
    return {
        "unread_count": unread_count,
        "items": [
            {
                "id": item.id,
                "message": item.message,
                "notification_type": item.notification_type,
                "post_id": item.post_id,
                "comment_id": item.comment_id,
                "is_read": item.is_read,
                "created_at": item.created_at,
                "actor": (
                    {
                        "display_name": actor.display_name or actor.username,
                        "avatar_url": actor.avatar_url,
                    }
                    if (actor := db.query(User).filter(User.id == item.actor_user_id).first())
                    else None
                ),
            }
            for item in notifications
        ],
    }


@router.post("/notifications/read")
def mark_notifications_read(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    db.query(Notification).filter(
        Notification.recipient_user_id == current_user.id,
        Notification.is_read.is_(False),
    ).update({"is_read": True}, synchronize_session=False)
    db.commit()
    return {"success": True}
