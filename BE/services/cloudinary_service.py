import os
from typing import BinaryIO

import cloudinary
import cloudinary.uploader
from dotenv import load_dotenv

load_dotenv()


def is_configured() -> bool:
    return all(
        (
            os.getenv("CLOUDINARY_CLOUD_NAME"),
            os.getenv("CLOUDINARY_API_KEY"),
            os.getenv("CLOUDINARY_API_SECRET"),
        )
    )


def upload_image(file_object: BinaryIO, folder: str) -> dict[str, str]:
    if not is_configured():
        raise RuntimeError("Cloudinary chưa được cấu hình trong môi trường.")

    cloudinary.config(
        cloud_name=os.environ["CLOUDINARY_CLOUD_NAME"],
        api_key=os.environ["CLOUDINARY_API_KEY"],
        api_secret=os.environ["CLOUDINARY_API_SECRET"],
        secure=True,
    )
    result = cloudinary.uploader.upload(file_object, folder=folder, resource_type="image")
    return {
        "url": str(result["secure_url"]),
        "public_id": str(result["public_id"]),
    }


def delete_image(public_id: str) -> None:
    if not is_configured():
        raise RuntimeError("Cloudinary chưa được cấu hình trong môi trường.")
    cloudinary.config(
        cloud_name=os.environ["CLOUDINARY_CLOUD_NAME"],
        api_key=os.environ["CLOUDINARY_API_KEY"],
        api_secret=os.environ["CLOUDINARY_API_SECRET"],
        secure=True,
    )
    cloudinary.uploader.destroy(public_id, resource_type="image")
