import json
import logging
import os
from pathlib import Path
from typing import Any

import cv2
import numpy as np
import torch
from PIL import Image, ImageOps

from services.leafai_models import (
    CustomLeafCNN,
    LeafAI_Model,
    apply_clahe_preprocessing,
    load_checkpoint_strict,
)

logger = logging.getLogger(__name__)

BASE_DIR = Path(__file__).resolve().parent.parent
MODELS_DIR = BASE_DIR / "models"
WEIGHTS_DIR = MODELS_DIR / "models"
CONFIGS_DIR = MODELS_DIR / "configs"

# Mặc định 16 loài dược liệu chuẩn của LeafAI_PBL4_Deploy_16Classes
DEFAULT_LEAFAI_CLASS_NAMES = [
    "Aloe",
    "Bitter Gourd",
    "Centella asiatica",
    "Coffee",
    "Grape",
    "Guava",
    "Hibiscus",
    "Jackfruit",
    "Lemon",
    "Mango",
    "Neem",
    "Orange",
    "Papaya",
    "Tea",
    "Tomato",
    "Tulsi",
]


def _read_json(path: Path) -> dict[str, Any]:
    if path.is_file():
        try:
            return json.loads(path.read_text(encoding="utf-8"))
        except Exception as exc:
            logger.warning(f"Không thể đọc {path}: {exc}")
    return {}


def _load_class_names() -> list[str]:
    mapping = _read_json(CONFIGS_DIR / "class_mapping.json")
    classes = mapping.get("classes")
    if isinstance(classes, list) and len(classes) > 0:
        return [str(c) for c in classes]
    idx_to_class = mapping.get("idx_to_class")
    if isinstance(idx_to_class, dict) and len(idx_to_class) > 0:
        return [str(idx_to_class[str(i)]) for i in range(len(idx_to_class))]
    return list(DEFAULT_LEAFAI_CLASS_NAMES)


def _load_preprocessing_config() -> dict[str, Any]:
    cfg = _read_json(CONFIGS_DIR / "preprocessing_config.json")
    clahe = cfg.get("clahe") or {}
    norm = cfg.get("normalization") or {}
    resize = cfg.get("resize") or [224, 224]
    tile = clahe.get("tile_grid_size") or [8, 8]
    return {
        "image_size": (int(resize[0]), int(resize[1])),
        "clip_limit": float(clahe.get("clip_limit", 2.0)),
        "tile_grid_size": (int(tile[0]), int(tile[1])),
        "mean": tuple(float(v) for v in (norm.get("mean") or [0.485, 0.456, 0.406])),
        "std": tuple(float(v) for v in (norm.get("std") or [0.229, 0.224, 0.225])),
    }


def _load_model1_thresholds() -> dict[str, float]:
    data = _read_json(CONFIGS_DIR / "model1_thresholds.json")
    return {
        "msp_thresh": float(data.get("msp_thresh", 0.9)),
        "cos_thresh": float(data.get("cos_thresh", 0.6008)),
        "dist_z_thresh": float(data.get("dist_z_thresh", 2.5)),
    }


def _load_model2_threshold() -> float:
    data = _read_json(CONFIGS_DIR / "model2_thresholds.json")
    return float(data.get("msp_thresh", 0.9))


LEAFAI_CLASS_NAMES: list[str] = _load_class_names()
PREPROC_CFG: dict[str, Any] = _load_preprocessing_config()

HERB_INFO_MAP: dict[str, dict[str, str]] = {
    "Aloe": {
        "slug": "aloevera",
        "name": "Lô hội (Nha đam)",
        "scientific": "Aloe vera (L.) Burm.f.",
        "dataset_name": "Aloevera",
    },
    "Bitter Gourd": {
        "slug": "bitter-gourd",
        "name": "Khổ qua (Mướp đắng)",
        "scientific": "Momordica charantia L.",
        "dataset_name": "Bitter Gourd",
    },
    "Centella asiatica": {
        "slug": "centella-asiatica",
        "name": "Rau má",
        "scientific": "Centella asiatica (L.) Urb.",
        "dataset_name": "Centella asiatica",
    },
    "Coffee": {
        "slug": "coffee",
        "name": "Cà phê",
        "scientific": "Coffea arabica L.",
        "dataset_name": "Coffee",
    },
    "Grape": {
        "slug": "grape",
        "name": "Nho",
        "scientific": "Vitis vinifera L.",
        "dataset_name": "Grape",
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
    "Neem": {
        "slug": "neem",
        "name": "Xoan Ấn Độ (Sầu đâu)",
        "scientific": "Azadirachta indica A.Juss.",
        "dataset_name": "Neem",
    },
    "Orange": {
        "slug": "orange",
        "name": "Cam",
        "scientific": "Citrus × sinensis (L.) Osbeck",
        "dataset_name": "Orange",
    },
    "Papaya": {
        "slug": "papaya",
        "name": "Đu đủ",
        "scientific": "Carica papaya L.",
        "dataset_name": "Papaya",
    },
    "Tea": {
        "slug": "tea",
        "name": "Trà xanh (Chè xanh)",
        "scientific": "Camellia sinensis (L.) Kuntze",
        "dataset_name": "Tea",
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
    "efficientnet_b0": {
        "id": "efficientnet_b0",
        "name": "EfficientNet-B0",
        "accuracy": "99.32%",
        "accuracy_value": 99.32,
        "osr_accuracy": "99.92%",
        "description": "Model 1: EfficientNet-B0 + CLAHE + Prototype Open-Set Recognition (16 loài).",
        "filename": "models/model1_best.pth",
        "framework": "pytorch_model1",
        "input_size": PREPROC_CFG["image_size"],
        "class_names": LEAFAI_CLASS_NAMES,
    },
    "custom_cnn_v2": {
        "id": "custom_cnn_v2",
        "name": "CustomLeafCNN",
        "accuracy": "97.76%",
        "accuracy_value": 97.76,
        "osr_accuracy": "99.72%",
        "description": "Model 2: CustomLeafCNN 5 khối + CLAHE + MSP Open-Set Recognition (16 loài).",
        "filename": "models/model2_best.pth",
        "framework": "pytorch_model2",
        "input_size": PREPROC_CFG["image_size"],
        "class_names": LEAFAI_CLASS_NAMES,
    },
}

_active_model_id = os.getenv("DEFAULT_MODEL", "efficientnet_b0")
_loaded_models: dict[str, Any] = {}
_device = torch.device("cuda" if torch.cuda.is_available() else "cpu")


def get_available_models() -> list[dict[str, Any]]:
    current_id = get_active_model_id()
    result = []
    for m_id, cfg in MODEL_CONFIGS.items():
        model_path = MODELS_DIR / cfg["filename"]
        result.append(
            {
                "id": m_id,
                "name": cfg["name"],
                "accuracy": cfg.get("accuracy", ""),
                "accuracy_value": cfg.get("accuracy_value", 0.0),
                "osr_accuracy": cfg.get("osr_accuracy", ""),
                "description": cfg["description"],
                "framework": cfg.get("framework", "pytorch_model1"),
                "num_classes": len(cfg.get("class_names", LEAFAI_CLASS_NAMES)),
                "input_size": list(cfg["input_size"]),
                "filename": cfg["filename"],
                "is_available": model_path.exists(),
                "is_active": m_id == current_id,
            }
        )
    return result


def get_active_model_id() -> str:
    global _active_model_id
    if _active_model_id not in MODEL_CONFIGS:
        _active_model_id = "efficientnet_b0"
    return _active_model_id


def set_active_model_id(model_id: str) -> bool:
    global _active_model_id
    if model_id in MODEL_CONFIGS:
        _active_model_id = model_id
        logger.info(f"Đã chuyển mô hình hoạt động sang: {model_id}")
        return True
    return False


def load_model_instance(model_id: str) -> dict[str, Any]:
    if model_id not in MODEL_CONFIGS:
        raise ValueError(f"Mô hình không hợp lệ: {model_id}")

    if model_id in _loaded_models:
        return _loaded_models[model_id]

    cfg = MODEL_CONFIGS[model_id]
    model_path = MODELS_DIR / cfg["filename"]
    if not model_path.exists():
        raise FileNotFoundError(f"Không tìm thấy file mô hình tại {model_path}")

    framework = cfg["framework"]
    num_classes = len(cfg["class_names"])
    logger.info(f"Đang nạp mô hình {cfg['name']} ({framework}, {num_classes} lớp) từ {model_path}...")

    if framework == "pytorch_model1":
        model = LeafAI_Model(num_classes=num_classes, pretrained=False)
        load_checkpoint_strict(model, model_path, device=_device)
        thresholds = _load_model1_thresholds()
        bundle = {"model": model, "thresholds": thresholds}
        _loaded_models[model_id] = bundle
        logger.info(f"Nạp thành công Model 1 ({cfg['name']}) với ngưỡng OSR: {thresholds}")
        return bundle

    if framework == "pytorch_model2":
        model = CustomLeafCNN(num_classes=num_classes)
        load_checkpoint_strict(model, model_path, device=_device)
        msp_thresh = _load_model2_threshold()
        bundle = {"model": model, "msp_thresh": msp_thresh}
        _loaded_models[model_id] = bundle
        logger.info(f"Nạp thành công Model 2 ({cfg['name']}) với msp_thresh={msp_thresh:.4f}")
        return bundle

    raise ValueError(f"Framework không được hỗ trợ: {framework}")


def warmup_models() -> None:
    for model_id, cfg in MODEL_CONFIGS.items():
        try:
            model_path = MODELS_DIR / cfg["filename"]
            if not model_path.exists():
                logger.warning(f"Bỏ qua làm nóng {model_id}: không tìm thấy {model_path}")
                continue
            loaded = load_model_instance(model_id)
            dummy_t = torch.zeros((1, 3, *cfg["input_size"]), dtype=torch.float32, device=_device)
            with torch.no_grad():
                _ = loaded["model"](dummy_t)
            logger.info(f"Làm nóng mô hình {model_id} thành công!")
        except Exception as exc:
            logger.warning(f"Không thể làm nóng mô hình {model_id}: {exc}")


def preprocess_leafai_image(image: Image.Image) -> torch.Tensor:
    """EXIF -> RGB -> CLAHE -> giữ tỷ lệ/padding 224x224 -> Normalize."""
    # Chuẩn hóa hướng ảnh trước để ảnh chụp từ điện thoại không bị xoay sai.
    image = ImageOps.exif_transpose(image)
    if image.mode != "RGB":
        image = image.convert("RGB")
    rgb_np = np.asarray(image, dtype=np.uint8)
    bgr_np = cv2.cvtColor(rgb_np, cv2.COLOR_RGB2BGR)
    # Dùng đúng pipeline lúc huấn luyện: CLAHE, letterbox và ImageNet normalization.
    tensor = apply_clahe_preprocessing(
        bgr_np,
        image_size=PREPROC_CFG["image_size"],
        clip_limit=PREPROC_CFG["clip_limit"],
        tile_grid_size=PREPROC_CFG["tile_grid_size"],
        mean=PREPROC_CFG["mean"],
        std=PREPROC_CFG["std"],
    )
    return tensor.to(_device)


def validate_image_quality(
    image: Image.Image,
    min_dimension: int = 128,
    min_brightness: float = 20.0,
    max_brightness: float = 235.0,
    min_sharpness: float = 15.0,
) -> None:
    """Reject images too small, too dark/bright, or too blurry for reliable inference."""
    checked_image = ImageOps.exif_transpose(image).convert("RGB")
    width, height = checked_image.size
    # Loại ảnh không đủ thông tin trước inference để tránh dự đoán thiếu tin cậy.
    if min(width, height) < min_dimension:
        raise ValueError(
            f"Ảnh quá nhỏ ({width}x{height}). Vui lòng dùng ảnh có cạnh tối thiểu "
            f"{min_dimension}px."
        )

    rgb_np = np.asarray(checked_image, dtype=np.uint8)
    gray = cv2.cvtColor(rgb_np, cv2.COLOR_RGB2GRAY)
    brightness = float(gray.mean())
    # Brightness trung bình nằm ngoài khoảng này thường làm mất chi tiết lá.
    if brightness < min_brightness:
        raise ValueError("Ảnh quá tối. Vui lòng chụp lại ở nơi đủ sáng.")
    if brightness > max_brightness:
        raise ValueError("Ảnh quá sáng. Vui lòng giảm ánh sáng hoặc tránh ngược sáng.")

    sharpness = float(cv2.Laplacian(gray, cv2.CV_64F).var())
    # Variance Laplacian thấp là dấu hiệu ảnh bị rung hoặc mất nét.
    if sharpness < min_sharpness:
        raise ValueError("Ảnh quá mờ. Vui lòng giữ máy ổn định và chụp lại.")


def _build_candidates(probs: np.ndarray, class_names: list[str], top_k: int = 5) -> list[dict[str, Any]]:
    top_indices = np.argsort(probs)[::-1][:top_k]
    candidates = []
    for idx in top_indices:
        c_idx = int(idx)
        c_name = class_names[c_idx] if c_idx < len(class_names) else f"Class_{c_idx}"
        c_info = HERB_INFO_MAP.get(
            c_name,
            {"slug": c_name.lower().replace(" ", "-"), "name": c_name, "scientific": ""},
        )
        c_prob = float(probs[c_idx])
        candidates.append(
            {
                "class_name": c_name,
                "name": c_info["name"],
                "scientific": c_info.get("scientific", ""),
                "slug": c_info.get("slug", c_name.lower().replace(" ", "-")),
                "confidence": f"{c_prob * 100:.2f}%",
                "confidence_value": round(c_prob * 100, 2),
            }
        )
    return candidates


def predict_image(image: Image.Image, model_id: str | None = None) -> dict[str, Any]:
    target_model_id = model_id or get_active_model_id()
    if target_model_id not in MODEL_CONFIGS:
        target_model_id = get_active_model_id()

    cfg = MODEL_CONFIGS[target_model_id]
    framework = cfg["framework"]
    class_names: list[str] = cfg["class_names"]
    loaded = load_model_instance(target_model_id)
    tensor_x = preprocess_leafai_image(image)

    if framework == "pytorch_model1":
        model: LeafAI_Model = loaded["model"]
        thresholds: dict[str, float] = loaded["thresholds"]
        osr_res = model.predict_open_set(tensor_x, thresholds=thresholds)
        probs = osr_res["probs"][0].detach().cpu().numpy()
        is_known = bool(osr_res["is_known"][0].item())
        osr_info: dict[str, Any] = {
            "status": "KNOWN" if is_known else "UNKNOWN",
            "method": "Prototype OSR (MSP + Cosine + Distance Z-score)",
            "votes": f"{int(osr_res['votes'][0].item())}/3",
            "msp": round(float(osr_res["msp"][0].item()) * 100, 2),
            "cosine": round(float(osr_res["cosine"][0].item()), 4),
            "dist_z": round(float(osr_res["dist_z"][0].item()), 3),
            "thresholds": thresholds,
        }
    else:
        model2: CustomLeafCNN = loaded["model"]
        msp_thresh: float = loaded["msp_thresh"]
        osr_list = model2.predict_open_set(tensor_x, msp_threshold=msp_thresh, class_names=class_names)
        res0 = osr_list[0]
        probs = np.asarray(res0["probabilities"], dtype=np.float32)
        is_known = res0["status"] == "KNOWN"
        osr_info = {
            "status": res0["status"],
            "method": "MSP Open-Set (95% Validation)",
            "msp": round(float(res0["confidence_msp"]) * 100, 2),
            "msp_threshold": round(float(msp_thresh) * 100, 2),
        }

    enable_osr = os.getenv("ENABLE_OSR", "true").strip().lower() in ("true", "1", "yes")
    if not enable_osr:
        is_known = True
        osr_info["status"] = "BYPASSED"
        osr_info["method"] = "OSR tắt qua cấu hình ENABLE_OSR=false"

    top_candidates = _build_candidates(probs, class_names, top_k=5)
    best_candidate = top_candidates[0]
    top_prob_pct = best_candidate["confidence_value"]

    if is_known:
        predicted_name = best_candidate["name"]
        scientific_name = best_candidate["scientific"]
        class_name = best_candidate["class_name"]
        herb_slug = best_candidate["slug"]
    else:
        predicted_name = f"Chưa xác định (Ngoài tập {len(class_names)} loài)"
        scientific_name = f"Gần giống nhất: {best_candidate['name']} ({best_candidate['confidence']} — Từ chối bởi OSR)"
        class_name = "Rejected (UNKNOWN)"
        herb_slug = best_candidate["slug"]

    return {
        "status": "KNOWN" if is_known else "UNKNOWN",
        "is_known": is_known,
        "osr": osr_info,
        "model_id": target_model_id,
        "model_name": cfg["name"],
        "model_accuracy": cfg.get("accuracy", ""),
        "model_accuracy_value": cfg.get("accuracy_value", 0.0),
        "predicted_class": predicted_name,
        "scientific_name": scientific_name,
        "class_name": class_name,
        "herb_slug": herb_slug,
        "confidence": best_candidate["confidence"],
        "confidence_value": top_prob_pct,
        "top_candidates": top_candidates,
    }
