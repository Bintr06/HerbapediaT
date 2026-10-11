import io
import logging
import os
from contextlib import asynccontextmanager

from fastapi import Depends, FastAPI, File, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image, UnidentifiedImageError

from database import User, init_db
from routers import auth, community, herbs

logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(_app: FastAPI):
    del _app
    init_db()
    yield


app = FastAPI(title="HerbaPedia API", version="1.0.0", lifespan=lifespan)

allowed_origins = [
    origin.strip()
    for origin in os.getenv(
        "CORS_ORIGINS",
        "http://localhost:5500,http://127.0.0.1:5500,http://localhost:5173",
    ).split(",")
    if origin.strip()
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(community.router)
app.include_router(herbs.router)


@app.get("/")
def read_root():
    return {"message": "FastAPI Backend for Herbal Plant Recognition is running!"}


@app.post("/predict")
async def predict_leaf(
    file: UploadFile = File(...),
    current_user: User = Depends(auth.get_current_user),
):
    if file.content_type not in {"image/jpeg", "image/png", "image/webp"}:
        raise HTTPException(
            status_code=415,
            detail="Chỉ hỗ trợ ảnh JPEG, PNG hoặc WEBP",
        )

    image_data = await file.read()
    if len(image_data) > 10 * 1024 * 1024:
        raise HTTPException(status_code=413, detail="Ảnh không được vượt quá 10 MB")

    try:
        image = Image.open(io.BytesIO(image_data))
        image.verify()
    except (UnidentifiedImageError, OSError) as exc:
        raise HTTPException(status_code=400, detail="File ảnh không hợp lệ") from exc

    raise HTTPException(
        status_code=503,
        detail="Tính năng nhận diện AI chưa được cấu hình mô hình thực tế.",
    )
