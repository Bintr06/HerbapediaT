import json
import io
import logging
from datetime import datetime, timezone

import cloudinary
from fastapi import APIRouter, Depends, File, HTTPException, Query, UploadFile
from PIL import Image, UnidentifiedImageError
from pydantic import BaseModel, Field
from sqlalchemy import func
from sqlalchemy.orm import Session

from services.cloudinary_service import delete_image, upload_image
from database import Herb, HerbRemedy, HerbReview, HerbUsage, PredictionHistory, SessionLocal, User
from routers.auth import get_admin_user, get_current_user

router = APIRouter(prefix="/herbs", tags=["Herbs"])
logger = logging.getLogger(__name__)


class HerbPayload(BaseModel):
    slug: str = Field(min_length=1, max_length=100)
    dataset_name: str = Field(min_length=1, max_length=100)
    name: str = Field(min_length=1, max_length=255)
    scientific: str = Field(min_length=1, max_length=255)
    image: str | None = Field(default=None, max_length=1000)
    image_public_id: str | None = Field(default=None, max_length=255)
    tags: list[str] = Field(default_factory=list, max_length=20)
    usage: str = Field(min_length=1)
    parts: str = Field(min_length=1)
    identification: str = Field(min_length=1)
    safety: str = Field(min_length=1)
    habitat: str | None = None
    preparation: str | None = None
    caution: str | None = None
    usageDetails: list[str] = Field(default_factory=list, max_length=20)
    remedies: list[str] = Field(default_factory=list, max_length=20)


class HerbReviewPayload(BaseModel):
    rating: int = Field(ge=1, le=5)
    content: str = Field(min_length=1, max_length=500)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def herb_response(herb: Herb, db: Session) -> dict:
    usages = db.query(HerbUsage).filter(
        HerbUsage.herb_id == herb.id
    ).order_by(HerbUsage.sort_order).all()
    remedies = db.query(HerbRemedy).filter(
        HerbRemedy.herb_id == herb.id
    ).order_by(HerbRemedy.sort_order).all()
    return {
        "id": herb.id,
        "slug": herb.slug,
        "dataset_name": herb.dataset_name,
        "datasetName": herb.dataset_name,
        "name": herb.name_vi,
        "scientific": herb.scientific_name,
        "image": herb.image_url,
        "image_public_id": herb.image_public_id,
        "tags": json.loads(herb.tags_json or "[]"),
        "usage": herb.usage,
        "parts": herb.parts_used,
        "identification": herb.identification,
        "safety": herb.safety,
        "habitat": herb.habitat,
        "preparation": herb.preparation,
        "caution": herb.caution,
        "usageDetails": [item.usage_text for item in usages],
        "remedies": [item.remedy_text for item in remedies],
        "created_at": herb.created_at,
        "updated_at": herb.updated_at,
    }


def _find_herb(identifier: str, db: Session) -> Herb | None:
    if identifier.isdigit():
        return db.query(Herb).filter((Herb.id == int(identifier)) | (Herb.slug == identifier)).first()
    return db.query(Herb).filter(Herb.slug == identifier).first()


@router.get("")
def list_herbs(
    q: str | None = Query(default=None, max_length=100),
    category: str | None = Query(default=None, max_length=50),
    db: Session = Depends(get_db),
):
    query = db.query(Herb)
    if q and q.strip():
        keyword = f"%{q.strip()}%"
        query = query.filter(
            (Herb.slug.ilike(keyword))
            | (Herb.dataset_name.ilike(keyword))
            | (Herb.name_vi.ilike(keyword))
            | (Herb.scientific_name.ilike(keyword))
            | (Herb.usage.ilike(keyword))
        )
    herbs = query.order_by(Herb.name_vi).all()
    if category and category.strip():
        category_text = category.strip().lower()
        herbs = [
            herb for herb in herbs
            if category_text in [tag.lower() for tag in json.loads(herb.tags_json or "[]")]
        ]
    return [herb_response(herb, db) for herb in herbs]


@router.get("/top-recognized")
def get_top_recognized_herbs(
    limit: int = Query(default=4, ge=1, le=20),
    db: Session = Depends(get_db),
):
    counts_query = (
        db.query(
            PredictionHistory.predicted_class,
            func.count(PredictionHistory.id).label("total_scans")
        )
        .group_by(PredictionHistory.predicted_class)
        .order_by(func.count(PredictionHistory.id).desc())
        .all()
    )

    all_herbs = db.query(Herb).order_by(Herb.id).all()
    herb_stats = []
    counted_herb_ids = set()

    for pred_class, count in counts_query:
        norm_pred = pred_class.strip().lower()
        matched_herb = next(
            (h for h in all_herbs if h.id not in counted_herb_ids and (
                h.slug.lower() == norm_pred
                or h.dataset_name.lower() == norm_pred
                or h.name_vi.lower() == norm_pred
                or norm_pred in h.name_vi.lower()
            )),
            None
        )
        if matched_herb:
            counted_herb_ids.add(matched_herb.id)
            herb_stats.append({
                "herb": matched_herb,
                "count": count
            })

    if len(herb_stats) < limit:
        for herb in all_herbs:
            if herb.id not in counted_herb_ids:
                counted_herb_ids.add(herb.id)
                herb_stats.append({
                    "herb": herb,
                    "count": 0
                })
            if len(herb_stats) >= limit:
                break

    results = []
    for rank, item in enumerate(herb_stats[:limit], start=1):
        herb = item["herb"]
        results.append({
            "id": herb.id,
            "slug": herb.slug,
            "name": herb.name_vi,
            "scientific": herb.scientific_name,
            "image": herb.image_url,
            "recognition_count": item["count"],
            "rank": rank,
        })

    return results


@router.get("/{slug}")
def get_herb(slug: str, db: Session = Depends(get_db)):
    herb = _find_herb(slug, db)
    if herb is None:
        raise HTTPException(status_code=404, detail="Không tìm thấy dược liệu.")
    return herb_response(herb, db)


def _sanitize_review_author(user: User | None) -> str:
    if not user:
        return "Người dùng"
    name = (user.display_name or "").strip()
    if not name or "@" in name:
        base = name if "@" in name else (user.username or "")
        name = base.split("@")[0].strip() if "@" in base else base
    if not name:
        name = f"Thành viên #{user.id}"
    return name


def _review_response(review: HerbReview, db: Session) -> dict:
    user = db.query(User).filter(User.id == review.user_id).first()
    return {
        "id": review.id,
        "rating": review.rating,
        "content": review.content,
        "created_at": review.created_at,
        "author": {
            "display_name": _sanitize_review_author(user),
            "avatar_url": user.avatar_url if user else None,
        },
    }


@router.get("/{slug}/community")
def get_community_data(slug: str, db: Session = Depends(get_db)):
    herb = _find_herb(slug, db)
    if herb is None:
        raise HTTPException(status_code=404, detail="Không tìm thấy dược liệu.")
    history_filter = (
        PredictionHistory.predicted_class.ilike(f"%{herb.slug}%")
        | PredictionHistory.predicted_class.ilike(f"%{herb.dataset_name}%")
        | PredictionHistory.predicted_class.ilike(f"%{herb.name_vi}%")
    )
    history_query = db.query(PredictionHistory).filter(
        history_filter
    ).order_by(PredictionHistory.created_at.desc())
    history = history_query.limit(8).all()
    reviews = db.query(HerbReview).filter(
        HerbReview.herb_id == herb.id
    ).order_by(HerbReview.created_at.desc()).limit(20).all()
    ratings = db.query(HerbReview.rating).filter(HerbReview.herb_id == herb.id).all()
    average = sum(item[0] for item in ratings) / len(ratings) if ratings else None
    return {
        "average_rating": round(average, 1) if average is not None else None,
        "review_count": len(ratings),
        "history_count": db.query(PredictionHistory).filter(history_filter).count(),
        "images": [item.image_url for item in history if item.image_url],
        "reviews": [_review_response(review, db) for review in reviews],
    }


@router.post("/{slug}/community/reviews", status_code=201)
def create_community_review(
    slug: str,
    payload: HerbReviewPayload,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    herb = _find_herb(slug, db)
    if herb is None:
        raise HTTPException(status_code=404, detail="Không tìm thấy dược liệu.")
    content = payload.content.strip()
    if not content:
        raise HTTPException(status_code=422, detail="Nội dung đánh giá không được để trống.")
    review = db.query(HerbReview).filter(
        HerbReview.herb_id == herb.id,
        HerbReview.user_id == current_user.id,
    ).first()
    now = datetime.now(timezone.utc)
    if review:
        review.rating = payload.rating
        review.content = content
        review.created_at = now
    else:
        review = HerbReview(
            herb_id=herb.id,
            user_id=current_user.id,
            rating=payload.rating,
            content=content,
            created_at=now,
        )
        db.add(review)
    db.commit()
    db.refresh(review)
    return _review_response(review, db)


@router.post("/upload-image", dependencies=[Depends(get_admin_user)])
async def upload_herb_image(file: UploadFile = File(...)):
    if file.content_type not in {"image/jpeg", "image/png", "image/webp"}:
        raise HTTPException(status_code=415, detail="Ảnh cây phải là JPEG, PNG hoặc WEBP.")
    image_data = await file.read()
    if len(image_data) > 5 * 1024 * 1024:
        raise HTTPException(status_code=413, detail="Ảnh cây không được vượt quá 5 MB.")
    try:
        image = Image.open(io.BytesIO(image_data))
        image.verify()
    except (UnidentifiedImageError, OSError) as exc:
        raise HTTPException(status_code=400, detail="File ảnh cây không hợp lệ.") from exc
    try:
        return upload_image(
            io.BytesIO(image_data),
            "herbapedia/herbs",
        )
    except (cloudinary.exceptions.Error, RuntimeError) as exc:
        raise HTTPException(
            status_code=503,
            detail="Không thể lưu ảnh cây lên Cloudinary.",
        ) from exc


def _validate_payload(payload: HerbPayload) -> None:
    if not all(tag.strip() for tag in payload.tags):
        raise HTTPException(status_code=422, detail="Nhóm công dụng không được để trống.")
    if any(not item.strip() for item in payload.usageDetails + payload.remedies):
        raise HTTPException(status_code=422, detail="Nội dung hướng dẫn không được để trống.")


def _apply_payload(herb: Herb, payload: HerbPayload, db: Session) -> None:
    herb.slug = payload.slug.strip().lower()
    herb.dataset_name = payload.dataset_name.strip()
    herb.name_vi = payload.name.strip()
    herb.scientific_name = payload.scientific.strip()
    herb.image_url = payload.image.strip() if payload.image else None
    herb.image_public_id = payload.image_public_id.strip() if payload.image_public_id else None
    herb.tags_json = json.dumps([tag.strip() for tag in payload.tags], ensure_ascii=False)
    herb.usage = payload.usage.strip()
    herb.parts_used = payload.parts.strip()
    herb.identification = payload.identification.strip()
    herb.safety = payload.safety.strip()
    herb.habitat = payload.habitat.strip() if payload.habitat else None
    herb.preparation = payload.preparation.strip() if payload.preparation else None
    herb.caution = payload.caution.strip() if payload.caution else None
    herb.updated_at = datetime.now(timezone.utc)
    if herb.id is None:
        db.flush()
    db.query(HerbUsage).filter(HerbUsage.herb_id == herb.id).delete()
    db.query(HerbRemedy).filter(HerbRemedy.herb_id == herb.id).delete()
    for index, item in enumerate(payload.usageDetails):
        db.add(HerbUsage(herb_id=herb.id, usage_text=item.strip(), sort_order=index))
    for index, item in enumerate(payload.remedies):
        db.add(HerbRemedy(herb_id=herb.id, remedy_text=item.strip(), sort_order=index))


def _ensure_unique(payload: HerbPayload, db: Session, herb_id: int | None = None) -> None:
    query = db.query(Herb).filter(
        (Herb.slug == payload.slug.strip().lower())
        | (Herb.dataset_name == payload.dataset_name.strip())
    )
    if herb_id is not None:
        query = query.filter(Herb.id != herb_id)
    if query.first() is not None:
        raise HTTPException(status_code=409, detail="Slug hoặc tên dataset đã tồn tại.")


@router.post("", status_code=201, dependencies=[Depends(get_admin_user)])
def create_herb(
    payload: HerbPayload,
    db: Session = Depends(get_db),
):
    _validate_payload(payload)
    _ensure_unique(payload, db)
    now = datetime.now(timezone.utc)
    herb = Herb(created_at=now, updated_at=now)
    db.add(herb)
    _apply_payload(herb, payload, db)
    db.commit()
    db.refresh(herb)
    return herb_response(herb, db)


@router.put("/{slug}", dependencies=[Depends(get_admin_user)])
def update_herb(
    slug: str,
    payload: HerbPayload,
    db: Session = Depends(get_db),
):
    herb = _find_herb(slug, db)
    if herb is None:
        raise HTTPException(status_code=404, detail="Không tìm thấy dược liệu.")
    _validate_payload(payload)
    _ensure_unique(payload, db, herb.id)
    old_image_public_id = herb.image_public_id
    _apply_payload(herb, payload, db)
    db.commit()
    db.refresh(herb)
    if old_image_public_id and old_image_public_id != herb.image_public_id:
        try:
            delete_image(old_image_public_id)
        except (cloudinary.exceptions.Error, RuntimeError):
            logger.warning("Không thể xóa ảnh cây cũ trên Cloudinary.", exc_info=True)
    return herb_response(herb, db)


@router.delete("/{slug}", status_code=204, dependencies=[Depends(get_admin_user)])
def delete_herb(
    slug: str,
    db: Session = Depends(get_db),
):
    herb = _find_herb(slug, db)
    if herb is None:
        raise HTTPException(status_code=404, detail="Không tìm thấy dược liệu.")
    db.query(HerbUsage).filter(HerbUsage.herb_id == herb.id).delete()
    db.query(HerbRemedy).filter(HerbRemedy.herb_id == herb.id).delete()
    image_public_id = herb.image_public_id
    db.delete(herb)
    db.commit()
    if image_public_id:
        try:
            delete_image(image_public_id)
        except (cloudinary.exceptions.Error, RuntimeError):
            logger.warning("Không thể xóa ảnh cây trên Cloudinary.", exc_info=True)
