# HerbaPedia 🌱 - Nền tảng Nhận diện & Tra cứu Dược liệu Thảo mộc thông minh

Hệ thống ứng dụng Trí tuệ nhân tạo (AI Deep Learning) kết hợp thiết bị nhúng IoT (Raspberry Pi Camera) hỗ trợ nhận diện nhanh, chính xác 20 loài cây thuốc và tra cứu từ điển 36+ thảo mộc y học cổ truyền Việt Nam.

---

## 🏛️ Kiến trúc Dự án (Monorepo Architecture)

Dự án được cấu trúc theo mô hình **Monorepo** chuẩn mực, tách biệt độc lập giữa Backend và Frontend:

```text
PBL4/
├── BE/                               # BACKEND (FastAPI - Python)
│   ├── main.py                       # Ứng dụng chính, CORS, Lifespan nạp AI Model
│   ├── database.py                   # Cấu hình SQLAlchemy ORM & Khai báo Models
│   ├── herb_seed.json                # Dữ liệu hạt giống chuẩn hóa 36+ cây thuốc
│   ├── requirements.txt              # Danh sách thư viện Python (đã ghim phiên bản an toàn)
│   ├── .env.example                  # Mẫu các biến môi trường cấu hình hệ thống
│   ├── routers/                      # API Endpoints
│   │   ├── auth.py                   # Đăng ký, đăng nhập JWT, đổi mật khẩu
│   │   ├── herbs.py                  # Tra cứu, chấm điểm liên quan, quản lý cây thuốc
│   │   └── community.py              # Đăng bài viết, bình luận, tương tác, thông báo
│   ├── services/                     # Business Logic Services
│   │   ├── model_service.py          # Nạp & dự đoán AI (Keras 3 / PyTorch backend)
│   │   ├── cloudinary_service.py     # Tải ảnh lưu trữ đám mây
│   │   └── email_service.py          # Gửi mã OTP xác thực qua email
│   └── models/                       # Thư mục chứa các mô hình Deep Learning (*.keras)
│
└── FE/                               # FRONTEND (HTML5, TailwindCSS, Vanilla JS)
    ├── index.html                    # Trang chủ & Nhận diện camera (Webcam / Raspberry Pi)
    ├── search.html                   # Tra cứu từ điển dược liệu (Xếp hạng theo Relevance)
    ├── detail.html                   # Chi tiết cây thuốc, công dụng & đánh giá
    ├── history.html                  # Bảng tin cộng đồng chia sẻ kinh nghiệm
    ├── personal-history.html         # Lịch sử quét nhận diện cá nhân
    ├── user-profile.html             # Hồ sơ cá nhân & Trang blog tác giả
    ├── auth.html                     # Giao diện Đăng nhập / Đăng ký tài khoản
    ├── admin.html                    # Cổng thông tin Quản trị viên (Admin Portal)
    └── assets/
        ├── js/
        │   ├── config.js             # Cấu hình API Base URL động (Localhost & Production)
        │   ├── camera.js             # Xử lý luồng Camera, quét ảnh & kết nối Raspberry Pi
        │   ├── search.js             # Thuật toán tìm kiếm & chấm điểm độ liên quan
        │   ├── main.js               # Header, Footer, thông báo & xác thực phiên
        │   └── ...                   # Các module JS tương ứng từng trang
        ├── css/                      # Stylesheet bổ trợ
        ├── images/                   # Logo, ảnh nền, mã QR Donate
        └── data/                     # herbs.js (Dữ liệu cây thuốc ngoại tuyến dự phòng)
```

---

## 🚀 Hướng dẫn Cài đặt & Chạy Localhost

### 1. Khởi chạy Backend (FastAPI)
Yêu cầu: **Python 3.10 - 3.12**

```powershell
# Di chuyển vào thư mục Backend
cd BE

# Tạo môi trường ảo (khuyến nghị)
python -m venv venv
.\venv\Scripts\Activate.ps1

# Cài đặt các thư viện phụ thuộc
pip install -r requirements.txt

# Tạo file cấu hình môi trường từ mẫu
copy .env.example .env

# Chạy server FastAPI
uvicorn main:app --reload --host 127.0.0.1 --port 8000
```
* **API Server:** `http://127.0.0.1:8000`
* **Swagger API Docs tương tác:** `http://127.0.0.1:8000/docs`

---

### 2. Khởi chạy Frontend
Yêu cầu: Bất kỳ Web Server tĩnh nào (ví dụ: VS Code Live Server hoặc Python http.server)

```powershell
# Mở terminal mới, di chuyển vào thư mục FE
cd FE

# Chạy server tĩnh đơn giản bằng Python:
python -m http.server 5500
```
* Truy cập ứng dụng tại: `http://127.0.0.1:5500`

---

## 🌐 Hướng dẫn Triển khai (Deployment Guide)

### Cách 1: Triển khai Đám mây Miễn phí (Vercel + Render)

1. **Frontend (Vercel / Netlify / Cloudflare Pages):**
   * Kết nối Repository GitHub.
   * Cài đặt **Root Directory**: `FE`
   * Build Command: *(Để trống)*
   * Output Directory: `.` *(Thư mục hiện tại)*
   * *Lưu ý:* Mở file `FE/assets/js/config.js` và cập nhật biến `PRODUCTION_API_URL` thành link backend trên Render.

2. **Backend (Render.com / Railway.app):**
   * Tạo **Web Service** mới từ GitHub repo.
   * **Root Directory**: `BE`
   * **Environment**: `Python 3`
   * **Build Command**: `pip install -r requirements.txt`
   * **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`
   * **Environment Variables**:
     * `CORS_ORIGINS`: Điền domain Frontend của bạn (ví dụ: `https://herbapedia.vercel.app`)
     * Các biến cấu hình Cloudinary, Database, JWT Secret từ file `.env.example`.

---

## ✨ Tính năng Nổi bật

* 🧠 **AI Deep Learning:** Nhận diện 20 loài dược liệu chính xác cao với kiến trúc MobileNetV3 và Custom CNN.
* 📷 **IoT Embedded Streaming:** Hỗ trợ nhận diện qua luồng video HTTP/MJPEG từ Raspberry Pi Camera hoặc Webcam trực tiếp.
* 🔍 **Smart Relevance Search:** Thuật toán tính điểm từ khóa độc lập, ưu tiên tuyệt đối cây trùng khớp (giải quyết triệt để lỗi false positive âm tiết tiếng Việt).
* 👥 **Cộng đồng & Blog:** Đăng bài chia sẻ bài thuốc, bình luận, tương tác thời gian thực và thông báo thông minh.
* 🛡️ **Quản trị Toàn diện:** Dashboard Admin quản lý dược liệu, phân quyền tài khoản và theo dõi sức khỏe hệ thống.
* 💖 **Ủng hộ Dự án (VietQR):** Tích hợp khối Donate tinh tế ở Footer kèm sao chép STK 1-chạm và phóng to mã QR.

---
© 2026 HerbaPedia. Phát triển vì sức khỏe cộng đồng & giáo dục thảo dược.

