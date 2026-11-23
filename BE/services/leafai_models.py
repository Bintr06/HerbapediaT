"""AI models and open-set recognition utilities for medicinal leaf images.

The preprocessing and OSR pipeline is documented in README.md and next to
the corresponding implementation below.
"""

from pathlib import Path
from typing import Any, Dict, List, Optional, Sequence, Tuple, Union

import cv2
import numpy as np
import torch
import torch.nn as nn
import torch.nn.functional as F
import torchvision.transforms as T
from PIL import Image, ImageOps
from torchvision import models


class LeafAI_Model(nn.Module):
    """EfficientNet-B0 phân loại 16 loài lá dược liệu + Prototype-based OSR."""

    def __init__(self, num_classes: int = 16, pretrained: bool = False) -> None:
        super().__init__()
        if num_classes <= 0:
            raise ValueError("num_classes phải lớn hơn 0.")

        self.num_classes = int(num_classes)
        weights = models.EfficientNet_B0_Weights.DEFAULT if pretrained else None
        self.base_model = models.efficientnet_b0(weights=weights)

        for param in self.base_model.features.parameters():
            param.requires_grad = False

        self.features = self.base_model.features
        self.pool = self.base_model.avgpool
        self.flatten = nn.Flatten()

        in_features = self.base_model.classifier[1].in_features  # 1280
        self.classifier = nn.Linear(in_features, self.num_classes)

        self.register_buffer("prototypes", torch.zeros(self.num_classes, in_features))
        self.register_buffer("class_mean_dist", torch.zeros(self.num_classes))
        self.register_buffer("class_std_dist", torch.ones(self.num_classes))
        self.register_buffer("prototypes_ready", torch.tensor(False, dtype=torch.bool))

    def forward(self, x: torch.Tensor) -> Tuple[torch.Tensor, torch.Tensor]:
        x = self.features(x)
        x = self.pool(x)
        feature_vector = self.flatten(x)
        logits = self.classifier(feature_vector)
        return logits, feature_vector

    def check_prototypes(self) -> None:
        if not bool(self.prototypes_ready.item()):
            raise RuntimeError(
                "Prototype chưa sẵn sàng trong checkpoint Model 1."
            )

    @torch.no_grad()
    def predict_open_set(
        self,
        x: torch.Tensor,
        thresholds: Optional[Dict[str, float]] = None,
        msp_thresh: float = 0.9,
        cos_thresh: float = 0.6008,
        dist_z_thresh: float = 2.0,
    ) -> Dict[str, torch.Tensor]:
        """Chạy 1 lượt forward duy nhất và đánh giá OSR (MSP + Cosine + Distance Z-score)."""
        if thresholds is not None:
            msp_thresh = float(thresholds.get("msp_thresh", msp_thresh))
            cos_thresh = float(thresholds.get("cos_thresh", cos_thresh))
            dist_z_thresh = float(thresholds.get("dist_z_thresh", dist_z_thresh))

        self.eval()
        self.check_prototypes()

        # --- THUẬT TOÁN 1: Phân phối xác suất Softmax & MSP (Maximum Softmax Probability) ---
        logits, feats = self.forward(x)
        probs = F.softmax(logits, dim=1)
        msp, pred_msp = probs.max(dim=1)

        # --- THUẬT TOÁN 2: Độ tương đồng Cosine (Cosine Similarity) với Prototypes 1280 chiều ---
        feats_norm = F.normalize(feats, p=2, dim=1)
        protos_norm = F.normalize(self.prototypes, p=2, dim=1)
        similarities = feats_norm @ protos_norm.t()
        cosine, pred_cos = similarities.max(dim=1)

        # --- THUẬT TOÁN 3: Khoảng cách Euclid (L2 Distance) & Z-Score Phát hiện dị biệt (Anomaly Detection) ---
        distances = torch.cdist(feats, self.prototypes, p=2)
        min_dist, pred_dist = distances.min(dim=1)
        std = self.class_std_dist[pred_dist].clamp_min(1e-6)
        z_score = (min_dist - self.class_mean_dist[pred_dist]) / std

        # --- THUẬT TOÁN 4: Cơ chế biểu quyết đa tiêu chí (Multi-criteria Voting) & Ngưỡng bảo vệ OSR ---
        ok_msp = msp >= msp_thresh         # Tiêu chí 1: Độ tự tin Softmax đạt chuẩn
        ok_cos = cosine >= cos_thresh       # Tiêu chí 2: Góc vector đặc trưng gần tâm lớp
        ok_dist = z_score <= dist_z_thresh  # Tiêu chí 3: Khoảng cách nằm trong khoảng tin cậy thống kê

        same_predicted_class = (
            (pred_msp == pred_cos)
            & (pred_msp == pred_dist)
            & (pred_cos == pred_dist)
        )

        votes = ok_msp.int() + ok_cos.int() + ok_dist.int()
        # Ba tiêu chí phải đồng thuận về cùng một lớp; tránh cộng phiếu lệch lớp.
        # Sau đó chỉ chấp nhận khi ít nhất hai trong ba tiêu chí đạt ngưỡng.
        is_known = (votes >= 2) & same_predicted_class

        pred = pred_msp.clone()
        pred[~is_known] = -1

        return {
            "probs": probs,
            "pred": pred,
            "is_known": is_known,
            "msp": msp,
            "cosine": cosine,
            "min_dist": min_dist,
            "dist_z": z_score,
            "votes": votes,
            "pred_msp": pred_msp,
            "pred_cos": pred_cos,
            "pred_dist": pred_dist,
        }


class CustomLeafCNN(nn.Module):
    """Kiến trúc CustomLeafCNN 5 khối (Block 1-4 có MaxPool2d, Block 5 không MaxPool2d)."""

    def __init__(self, num_classes: int = 16) -> None:
        super().__init__()
        self.num_classes = int(num_classes)

        self.block1 = nn.Sequential(
            nn.Conv2d(3, 32, kernel_size=3, padding=1),
            nn.BatchNorm2d(32),
            nn.ReLU(inplace=True),
            nn.MaxPool2d(kernel_size=2, stride=2),
        )
        self.block2 = nn.Sequential(
            nn.Conv2d(32, 64, kernel_size=3, padding=1),
            nn.BatchNorm2d(64),
            nn.ReLU(inplace=True),
            nn.MaxPool2d(kernel_size=2, stride=2),
        )
        self.block3 = nn.Sequential(
            nn.Conv2d(64, 128, kernel_size=3, padding=1),
            nn.BatchNorm2d(128),
            nn.ReLU(inplace=True),
            nn.MaxPool2d(kernel_size=2, stride=2),
        )
        self.block4 = nn.Sequential(
            nn.Conv2d(128, 256, kernel_size=3, padding=1),
            nn.BatchNorm2d(256),
            nn.ReLU(inplace=True),
            nn.MaxPool2d(kernel_size=2, stride=2),
        )
        self.block5 = nn.Sequential(
            nn.Conv2d(256, 512, kernel_size=3, padding=1),
            nn.BatchNorm2d(512),
            nn.ReLU(inplace=True),
        )

        self.adaptive_pool = nn.AdaptiveAvgPool2d(1)
        self.flatten = nn.Flatten()
        self.dropout = nn.Dropout(p=0.5)
        self.classifier = nn.Linear(512, self.num_classes)

    def forward(self, x: torch.Tensor) -> Tuple[torch.Tensor, torch.Tensor]:
        x = self.block1(x)
        x = self.block2(x)
        x = self.block3(x)
        x = self.block4(x)
        x = self.block5(x)
        x = self.adaptive_pool(x)
        features = self.flatten(x)
        logits = self.classifier(self.dropout(features))
        return logits, features

    @torch.no_grad()
    def predict_open_set(
        self,
        tensor_batch: torch.Tensor,
        msp_threshold: float,
        class_names: List[str],
    ) -> List[Dict[str, Any]]:
        self.eval()
        logits, _ = self.forward(tensor_batch)
        probs = F.softmax(logits, dim=1)
        best_probs, best_indices = probs.max(dim=1)

        results: List[Dict[str, Any]] = []
        for i in range(tensor_batch.size(0)):
            best_prob = float(best_probs[i].item())
            best_idx = int(best_indices[i].item())
            is_known = best_prob >= msp_threshold
            results.append(
                {
                    "status": "KNOWN" if is_known else "UNKNOWN",
                    "predicted_class_idx": best_idx if is_known else -1,
                    "predicted_class": class_names[best_idx] if is_known else "Rejected (UNKNOWN)",
                    "confidence_msp": best_prob,
                    "msp_threshold": msp_threshold,
                    "probabilities": probs[i].detach().cpu().numpy(),
                }
            )
        return results


def load_checkpoint_strict(
    model: nn.Module,
    checkpoint_path: Union[str, Path],
    device: torch.device,
) -> nn.Module:
    """Nạp checkpoint raw state_dict hoặc bundle dict với strict=True."""
    ckpt_path = Path(checkpoint_path)
    if not ckpt_path.is_file():
        raise FileNotFoundError(f"Không tìm thấy checkpoint: {ckpt_path}")

    try:
        checkpoint = torch.load(ckpt_path, map_location="cpu", weights_only=True)
    except Exception:
        checkpoint = torch.load(ckpt_path, map_location="cpu", weights_only=False)

    if isinstance(checkpoint, dict) and "model_state_dict" in checkpoint:
        state_dict = checkpoint["model_state_dict"]
    elif isinstance(checkpoint, dict) and "state_dict" in checkpoint:
        state_dict = checkpoint["state_dict"]
    elif isinstance(checkpoint, dict):
        state_dict = checkpoint
    else:
        raise TypeError("Định dạng checkpoint không hợp lệ.")

    if state_dict and all(isinstance(k, str) and k.startswith("module.") for k in state_dict):
        state_dict = {k[len("module."):]: v for k, v in state_dict.items()}

    model.load_state_dict(state_dict, strict=True)
    model.to(device)
    model.eval()
    return model


def apply_clahe_preprocessing(
    image_bgr: np.ndarray,
    image_size: Tuple[int, int] = (224, 224),
    clip_limit: float = 2.0,
    tile_grid_size: Tuple[int, int] = (8, 8),
    mean: Sequence[float] = (0.485, 0.456, 0.406),
    std: Sequence[float] = (0.229, 0.224, 0.225),
) -> torch.Tensor:
    """CLAHE -> giữ tỷ lệ và padding -> Resize 224x224 -> ImageNet Normalize."""
    if image_bgr is None:
        raise ValueError("Ảnh đầu vào không hợp lệ (None).")

    # --- THUẬT TOÁN: CLAHE (Contrast Limited Adaptive Histogram Equalization) ---
    # Tách kênh độ sáng L trong không gian LAB để cân bằng tương phản cục bộ, giữ nguyên màu sắc
    image_rgb = cv2.cvtColor(image_bgr, cv2.COLOR_BGR2RGB)
    lab = cv2.cvtColor(image_rgb, cv2.COLOR_RGB2LAB)
    l_ch, a_ch, b_ch = cv2.split(lab)
    clahe = cv2.createCLAHE(clipLimit=float(clip_limit), tileGridSize=tuple(tile_grid_size))
    cl = clahe.apply(l_ch)
    image_clahe = cv2.cvtColor(cv2.merge((cl, a_ch, b_ch)), cv2.COLOR_LAB2RGB)

    target_size = (int(image_size[0]), int(image_size[1]))
    resized = ImageOps.contain(
        Image.fromarray(image_clahe),
        target_size,
        method=Image.Resampling.BICUBIC,
    )
    background_color = tuple(
        max(0, min(255, round(float(channel) * 255)))
        for channel in mean
    )
    letterboxed = Image.new("RGB", target_size, background_color)
    letterboxed.paste(
        resized,
        (
            (target_size[0] - resized.width) // 2,
            (target_size[1] - resized.height) // 2,
        ),
    )

    transform = T.Compose(
        [
            T.ToTensor(),
            T.Normalize(mean=list(mean), std=list(std)),
        ]
    )
    return transform(letterboxed).unsqueeze(0)
