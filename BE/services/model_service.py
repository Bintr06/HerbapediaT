import logging
import os
from pathlib import Path
from typing import Any

import numpy as np
from PIL import Image

# Đặt backend cho Keras sang torch trước khi nạp thư viện Keras
os.environ.setdefault("KERAS_BACKEND", "torch")
import keras  # noqa: E402

logger = logging.getLogger(__name__)

BASE_DIR = Path(__file__).resolve().parent.parent
MODELS_DIR = BASE_DIR / "models"

# 20 loài dược liệu theo đúng thứ tự nhãn trong dataset (sắp xếp A-Z theo tên thư mục)
CLASS_NAMES = [
    "Aloe",
    "Arabian-jasmine",
    "Betel",
    "Brahmi",
    "Coffee",
    "Eucalyptus",
    "Guava",
    "Hibiscus",
    "Jackfruit",
    "Lemon",
    "Mango",
    "Marigold",
    "Mint",
    "Neem",
    "Onion",
    "Papaya",
    "Pepper",
    "Rose",
    "Tomato",
    "Tulsi",
]

HERB_INFO_MAP: dict[str, dict[str, str]] = {
    "Aloe": {
        "slug": "aloevera",
        "name": "Lô hội (Nha đam)",
        "scientific": "Aloe vera (L.) Burm.f.",
        "dataset_name": "Aloevera",
    },
    "Arabian-jasmine": {
        "slug": "jasmine",
        "name": "Hoa nhài (Hoa lài)",
        "scientific": "Jasminum sambac (L.) Aiton",
        "dataset_name": "Jasmine",
    },
    "Betel": {
        "slug": "betel",
        "name": "Trầu không",
        "scientific": "Piper betle L.",
        "dataset_name": "Betel",
    },
    "Brahmi": {
        "slug": "bhrami",
        "name": "Rau đắng biển (Brahmi)",
        "scientific": "Bacopa monnieri (L.) Wettst.",
        "dataset_name": "Bhrami",
    },
    "Coffee": {
        "slug": "coffee",
        "name": "Cà phê",
        "scientific": "Coffea arabica L.",
        "dataset_name": "Coffee",
    },
    "Eucalyptus": {
        "slug": "eucalyptus",
        "name": "Bạch đàn (Khuynh diệp)",
        "scientific": "Eucalyptus globulus Labill.",
        "dataset_name": "Eucalyptus",
    },
    "Guava": {
        "slug": "guava",
        "name": "Ổi",
        "scientific": "Psidium guajava L.",
        "dataset_name": "Guava",
    },
    "Hibiscus": {
        "slug": "hibiscus",
        "name": "Dâm bụt",
        "scientific": "Hibiscus rosa-sinensis L.",
        "dataset_name": "Hibiscus",
    },
    "Jackfruit": {
        "slug": "jackfruit",
        "name": "Mít",
        "scientific": "Artocarpus heterophyllus Lam.",
        "dataset_name": "Jackfruit",
    },
    "Lemon": {
        "slug": "lemon",
        "name": "Chanh vàng",
        "scientific": "Citrus limon (L.) Osbeck",
        "dataset_name": "Lemon",
    },
    "Mango": {
        "slug": "mango",
        "name": "Xoài",
        "scientific": "Mangifera indica L.",
        "dataset_name": "Mango",
    },
    "Marigold": {
        "slug": "marigold",
        "name": "Hoa vạn thọ",
        "scientific": "Tagetes erecta L.",
        "dataset_name": "Marigold",
    },
    "Mint": {
        "slug": "mint",
        "name": "Bạc hà",
        "scientific": "Mentha × piperita L.",
        "dataset_name": "Mint",
    },
    "Neem": {
        "slug": "neem",
        "name": "Xoan Ấn Độ (Sầu đâu)",
        "scientific": "Azadirachta indica A.Juss.",
        "dataset_name": "Neem",
    },
    "Onion": {
        "slug": "onion",
        "name": "Hành",
        "scientific": "Allium cepa L.",
        "dataset_name": "Onion",
    },
    "Papaya": {
        "slug": "papaya",
        "name": "Đu đủ",
        "scientific": "Carica papaya L.",
        "dataset_name": "Papaya",
    },
    "Pepper": {
        "slug": "pepper",
        "name": "Hồ tiêu (Tiêu)",
        "scientific": "Piper nigrum L.",
        "dataset_name": "Pepper",
    },
    "Rose": {
        "slug": "rose",
        "name": "Hoa hồng",
        "scientific": "Rosa chinensis Jacq.",
        "dataset_name": "Rose",
    },
    "Tomato": {
        "slug": "tomato",
        "name": "Cà chua",
        "scientific": "Solanum lycopersicum L.",
        "dataset_name": "Tomato",
    },
    "Tulsi": {
        "slug": "tulsi",
        "name": "Húng quế thánh (Hương nhu tía)",
        "scientific": "Ocimum tenuiflorum L.",
        "dataset_name": "Tulsi",
    },
}

MODEL_CONFIGS: dict[str, dict[str, Any]] = {
    "mobilenet_v3": {
        "id": "mobilenet_v3",
        "name": "MobileNetV3 (Fine-tuning)",
        "description": "Mô hình MobileNetV3 Large được huấn luyện Fine-tuning, tối ưu tốc độ và độ chính xác cao.",
        "filename": "mobilenet_leaf_model.keras",
        "input_size": (224, 224),
        "rescale": 1.0,
    },
    "custom_cnn": {
        "id": "custom_cnn",
        "name": "Custom CNN (From Scratch)",
        "description": "Mô hình mạng tích chập 5 khối CNN tự thiết kế và huấn luyện từ đầu.",
        "filename": "best_leaf_model.keras",
        "input_size": (224, 224),
        "rescale": 1.0 / 255.0,
    },
}

import threading

_active_model_id = os.getenv("DEFAULT_MODEL", "mobilenet_v3")
_loaded_models: dict[str, Any] = {}
_model_lock = threading.Lock()


def get_available_models() -> list[dict[str, Any]]:
    current_id = get_active_model_id()
    result = []
    for m_id, cfg in MODEL_CONFIGS.items():
        model_path = MODELS_DIR / cfg["filename"]
        result.append(
            {
                "id": m_id,
                "name": cfg["name"],
                "description": cfg["description"],
                "input_size": cfg["input_size"],
                "filename": cfg["filename"],
                "is_available": model_path.exists(),
                "is_active": m_id == current_id,
            }
        )
    return result


def get_active_model_id() -> str:
    global _active_model_id
    if _active_model_id not in MODEL_CONFIGS:
        _active_model_id = "mobilenet_v3"
    return _active_model_id


def set_active_model_id(model_id: str) -> bool:
    global _active_model_id
    if model_id in MODEL_CONFIGS:
        _active_model_id = model_id
        logger.info(f"Đã chuyển mô hình hoạt động sang: {model_id}")
        return True
    return False


def load_model_instance(model_id: str):
    if model_id not in MODEL_CONFIGS:
        raise ValueError(f"Mô hình không hợp lệ: {model_id}")

    if model_id in _loaded_models:
        return _loaded_models[model_id]

    with _model_lock:
        if model_id in _loaded_models:
            return _loaded_models[model_id]

        cfg = MODEL_CONFIGS[model_id]
        model_path = MODELS_DIR / cfg["filename"]
        if not model_path.exists():
            raise FileNotFoundError(f"Không tìm thấy file mô hình tại {model_path}")

        logger.info(f"Đang nạp mô hình {cfg['name']} từ {model_path}...")
        model = keras.saving.load_model(str(model_path))
        
        # Tự động đồng bộ kích thước input_shape từ mô hình thực tế
        try:
            in_shape = getattr(model, "input_shape", None)
            if in_shape and len(in_shape) >= 3 and in_shape[1] and in_shape[2]:
                cfg["input_size"] = (int(in_shape[1]), int(in_shape[2]))
                logger.info(f"Đã nhận diện kích thước đầu vào {cfg['name']}: {cfg['input_size']}")
            has_internal_rescaling = any(
                "rescaling" in getattr(layer, "name", "").lower() or "rescale" in getattr(layer, "name", "").lower()
                for layer in getattr(model, "layers", [])
            )
            if has_internal_rescaling:
                cfg["rescale"] = 1.0
                logger.info(f"Mô hình {cfg['name']} đã có tầng Rescaling nội bộ -> rescale = 1.0")
        except Exception as e:
            logger.warning(f"Không thể đọc tự động cấu hình mô hình: {e}")
        if hasattr(model, "eval"):
            try:
                model.eval()
            except Exception:
                pass

        _loaded_models[model_id] = model
        logger.info(f"Nạp thành công mô hình {cfg['name']}!")
        return model


def warmup_models():
    # Chỉ làm nóng mô hình đang kích hoạt để tiết kiệm RAM (512MB Render) và khởi động tức thì
    active_id = get_active_model_id()
    try:
        cfg = MODEL_CONFIGS.get(active_id)
        if cfg:
            model_path = MODELS_DIR / cfg["filename"]
            if model_path.exists():
                logger.info(f"Đang nạp trước mô hình mặc định: {cfg['name']}...")
                model = load_model_instance(active_id)
                dummy = np.zeros((1, *cfg["input_size"], 3), dtype=np.float32)
                try:
                    import torch
                    with torch.no_grad():
                        _ = model(dummy, training=False)
                except Exception:
                    _ = model(dummy, training=False)
                logger.info(f"Mô hình {active_id} ({cfg['name']}) đã sẵn sàng phục vụ dự đoán!")
    except Exception as exc:
        logger.warning(f"Không thể làm nóng mô hình {active_id}: {exc}")


def preprocess_image(image: Image.Image, target_size: tuple[int, int], rescale: float) -> np.ndarray:
    if image.mode != "RGB":
        image = image.convert("RGB")
    image = image.resize(target_size, Image.Resampling.BILINEAR)
    img_array = np.asarray(image, dtype=np.float32) * rescale
    return np.expand_dims(img_array, axis=0)


def predict_image(image: Image.Image, model_id: str | None = None) -> dict[str, Any]:
    target_model_id = model_id or get_active_model_id()
    if target_model_id not in MODEL_CONFIGS:
        target_model_id = get_active_model_id()

    cfg = MODEL_CONFIGS[target_model_id]
    model = load_model_instance(target_model_id)

    x = preprocess_image(image, cfg["input_size"], cfg["rescale"])

    try:
        import torch
        with torch.no_grad():
            preds = model(x, training=False)
            if hasattr(preds, "detach"):
                preds = preds.detach().cpu().numpy()
            elif hasattr(preds, "numpy"):
                preds = preds.numpy()
    except Exception:
        try:
            preds = model(x, training=False)
            if hasattr(preds, "detach"):
                preds = preds.detach().cpu().numpy()
            elif hasattr(preds, "numpy"):
                preds = preds.numpy()
        except Exception:
            preds = model.predict(x, verbose=0)

    probs = preds[0] if len(preds.shape) > 1 else preds
    top_indices = np.argsort(probs)[::-1][:5]
    top_idx = int(top_indices[0])
    top_prob = float(probs[top_idx])
    top_class = CLASS_NAMES[top_idx]
    herb_info = HERB_INFO_MAP.get(
        top_class,
        {"slug": top_class.lower(), "name": top_class, "scientific": ""},
    )

    top_candidates = []
    for idx in top_indices:
        c_name = CLASS_NAMES[int(idx)]
        c_info = HERB_INFO_MAP.get(
            c_name,
            {"slug": c_name.lower(), "name": c_name, "scientific": ""},
        )
        c_prob = float(probs[idx])
        top_candidates.append(
            {
                "class_name": c_name,
                "name": c_info["name"],
                "scientific": c_info.get("scientific", ""),
                "slug": c_info.get("slug", c_name.lower()),
                "confidence": f"{c_prob * 100:.1f}%",
                "confidence_value": round(c_prob * 100, 1),
            }
        )

    return {
        "model_id": target_model_id,
        "model_name": cfg["name"],
        "predicted_class": herb_info["name"],
        "scientific_name": herb_info.get("scientific", ""),
        "class_name": top_class,
        "herb_slug": herb_info.get("slug", top_class.lower()),
        "confidence": f"{top_prob * 100:.1f}%",
        "confidence_value": round(top_prob * 100, 1),
        "top_candidates": top_candidates,
    }

