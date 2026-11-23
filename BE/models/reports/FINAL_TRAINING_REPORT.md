# BÁO CÁO TỔNG KẾT HUẤN LUYỆN HỆ THỐNG NHẬN DIỆN LÁ CÂY (LEAFAI - PBL4)
- **Thời gian xuất báo cáo:** 2026-11-20 15:39:17
- **Phần cứng thực thi:** NVIDIA A100-SXM4-40GB | PyTorch `2.14.1+cu130` | Seed: `42`
- **Số loài lá chính thức:** 16 lớp (Aloe, Bitter Gourd, Centella asiatica, Coffee, Grape, Guava, Hibiscus, Jackfruit, Lemon, Mango, Neem, Orange, Papaya, Tea, Tomato, Tulsi)

---
## 1. Chất lượng Dữ liệu & Chia tập (Data Integrity & Anti-Leakage)
- **Tổng ảnh gốc trong `Goc/`:** 68,010 ảnh (Read-Only, bảo toàn 100%)
- **Ảnh lỗi đã loại khỏi danh sách chia:** 1 ảnh
- **Ảnh trùng MD5 100% đã lọc:** 3,876 ảnh (trùng chéo class: 389)
- **Tổng ảnh sạch đưa vào chia:** 64,133 ảnh
- **Phân bổ tập dữ liệu (Group-aware Stratified theo `dHash`):**
  - **Train:** 44,879 ảnh (69.98%)
  - **Validation:** 9,630 ảnh (15.02%)
  - **Test:** 9,624 ảnh (15.01%)
- **Kiểm tra rò rỉ (Data Leakage):** MD5 trùng = `0` | dHash trùng giữa các tập = `0` (ĐẠT CHUẨN)

---
## 2. Kết quả So sánh Model 1 vs Model 2 trên tập Test
| Tiêu chí | Model 1 (EfficientNet-B0) | Model 2 (CustomLeafCNN) | Chênh lệch (M1 - M2) |
|---|---:|---:|---:|
| Test Accuracy (%) | 99.32 | 97.76 | +1.57 |
| Macro Precision (%) | 99.19 | 97.71 | +1.47 |
| Macro Recall (%) | 99.26 | 97.69 | +1.57 |
| Macro F1-Score (%) | 99.21 | 97.67 | +1.54 |
| Open-set Known Accept (%) | 94.33 | 93.03 | +1.3 |
| Open-set Acc sau lọc (%) | 99.92 | 99.72 | +0.2 |
| Inference Speed (ms/ảnh) | 0.34 | 0.114 | +0.226 |
| Throughput (ảnh/giây) | 2941.6 | 8757.7 | -5816.1 |
| Checkpoint Size (MB) | 36.16 | 6.04 | +30.12 |
| Total Parameters (Triệu) | 5.31 | 1.58 | +3.73 |

---
## 3. Cấu hình Open-set Recognition đã chốt
- **Model 1 (EfficientNet-B0 — MSP + Cosine + Distance Z-score):**
  - Ngưỡng: `msp=0.90`, `cos=0.6008`, `dist_z=2.5`
  - Tập Test (Known): Accept = **94.33%** | Acc sau lọc = **99.92%**
- **Model 2 (CustomLeafCNN — MSP):**
  - Ngưỡng: `msp=0.90`
  - Tập Test (Known): Accept = **93.03%** | Acc sau lọc = **99.72%**

---
## 4. Khuyến nghị Triển khai (Backend FastAPI)
- **Ưu tiên độ chính xác & lọc Open-set chặt chẽ:** Chọn **Model 1 (EfficientNet-B0)** (tích hợp sẵn 16 Prototypes trong `model1_bundle.pth`).
- **Ưu tiên gọn nhẹ & tốc độ trên thiết bị yếu:** Chọn **Model 2 (CustomLeafCNN)** (`model2_bundle.pth`, chỉ 6.04 MB).
- **Chiến lược chạy song song:** Triển khai cả 2 mô hình trên FastAPI để đối chiếu chéo hoặc cho phép chuyển đổi linh hoạt.