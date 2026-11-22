# HerbaPedia 🌱 - Hệ Thống Nhận Diện & Tra Cứu Dược Liệu Thông Minh (PBL4)

Hệ thống ứng dụng **Trí tuệ nhân tạo (AI Deep Learning)** kết hợp thiết bị **IoT (Raspberry Pi Camera)** hỗ trợ nhận diện nhanh, chính xác 16 loài lá dược liệu với cơ chế **Nhận diện tập mở (Open-Set Recognition - OSR)** và tra cứu từ điển cây thuốc chuẩn y học cổ truyền Việt Nam.

---

## 🌟 Tính Năng Nổi Bật

- 🌿 **Dual AI Models (Phân loại 16 loài lá dược liệu)**:
  - **Model 1: EfficientNet-B0 (Độ chính xác 99.32%)**: Kiến trúc mạng hiện đại kết hợp cơ chế chú ý Squeeze-and-Excitation và trích xuất vector đặc trưng $1280$ chiều.
  - **Model 2: CustomLeafCNN (Độ chính xác 97.76%)**: Mạng CNN sâu 5 khối tích chập do nhóm tự thiết kế, siêu nhẹ và tối ưu hóa tài nguyên phần cứng.
- 🛡️ **Cơ Chế Nhận Diện Tập Mở (Open-Set Recognition - OSR)**:
  - Phát hiện và từ chối các đối tượng lạ, ảnh không thuộc tập 16 loài dược liệu (ngăn chặn hiện tượng nhận diện sai lệch/đoán bừa của mô hình Deep Learning truyền thống).
  - Kết hợp 3 thước đo: **MSP (Maximum Softmax Probability)**, **Cosine Similarity** với tâm lớp nguyên mẫu (Prototypes) và **Phân tích khoảng cách dị biệt Z-score**.
- 📸 **Thu Nhận Hình Ảnh Linh Hoạt**:
  - Hỗ trợ trực tiếp từ **Webcam / Camera điện thoại**, **Tải tệp ảnh lên** và luồng video streaming từ **Raspberry Pi Camera** qua mạng nội bộ.
- 📚 **Dữ Liệu Dược Học & Hình Thái Chuẩn Xác**:
  - Cung cấp đầy đủ thông tin: *Đặc điểm nhận diện hình thái lá, Hoạt tính sinh học, Môi trường sống, Cách sơ chế & chế biến, Kinh nghiệm dân gian và Cảnh báo an toàn y khoa*.
- 👥 **Mạng Xã Hội Thảo Dược & Cộng Đồng**:
  - Đăng bài chia sẻ kinh nghiệm sử dụng dược liệu, bình luận tương tác, đánh giá độ tin cậy cộng đồng cho từng loài cây.
- ⚙️ **Cổng Quản Trị Viên (Admin Portal)**:
  - Giám sát trạng thái hoạt động hệ thống, quản lý cơ sở dữ liệu cây thuốc và người dùng.

---

## 🏛️ Kiến Trúc Hệ Thống (Monorepo Architecture)

```text
PBL4/
├── BE/                               # BACKEND (FastAPI - Python)
│   ├── main.py                       # Ứng dụng chính FastAPI, cấu hình CORS & Lifespan nạp mô hình AI
│   ├── database.py                   # Cấu hình SQLAlchemy ORM, kết nối MySQL & định nghĩa Models
│   ├── herb_seed.json                # Bộ dữ liệu hạt giống chuẩn hóa thông tin dược liệu
│   ├── requirements.txt              # Danh sách thư viện phụ thuộc (PyTorch, Torchvision, OpenCV...)
│   ├── .env                          # Biến môi trường hệ thống (Database, JWT, Cloudinary, ENABLE_OSR)
│   ├── routers/                      # Các Router API nghiệp vụ
│   │   ├── auth.py                   # Đăng ký, đăng nhập JWT, đổi mật khẩu, xác thực người dùng
│   │   ├── herbs.py                  # API tra cứu danh mục, tìm kiếm và chi tiết dược liệu
│   │   └── community.py              # Đăng bài viết cộng đồng, bình luận, tương tác thời gian thực
│   ├── services/                     # Business Logic Services
│   │   ├── leafai_models.py          # Kiến trúc PyTorch EfficientNet-B0, CustomLeafCNN, OSR & CLAHE
│   │   ├── model_service.py          # Quản lý vòng đời mô hình AI, tiền xử lý và suy luận dự đoán
│   │   ├── cloudinary_service.py     # Tải ảnh lưu trữ đám mây Cloudinary CDN
│   │   └── email_service.py          # Gửi mã OTP xác thực qua email SMTP
│   └── models/                       # Trọng số mô hình & Cấu hình AI
│       ├── configs/                  # class_mapping.json, preprocessing_config.json, thresholds
│       └── models/                   # Trọng số PyTorch (model1_best.pth, model2_best.pth)
│
└── FE/                               # FRONTEND (HTML5, TailwindCSS, Vanilla JS)
    ├── index.html                    # Trang chủ & Giao diện quét ảnh nhận diện (Webcam/IoT/File)
    ├── result.html                   # Trang hiển thị kết quả phân loại AI & trạng thái xác thực OSR
    ├── search.html                   # Tra cứu từ điển dược liệu theo tên, hoạt chất, công dụng
    ├── detail.html                   # Trang chi tiết cây thuốc: hình thái, dược tính, lưu ý an toàn
    ├── history.html                  # Diễn đàn cộng đồng chia sẻ kiến thức & thảo luận
    ├── personal-history.html         # Nhật ký quét nhận diện cá nhân của người dùng
    ├── user-profile.html             # Trang cá nhân & bài viết đã đăng
    ├── auth.html                     # Giao diện Đăng nhập / Đăng ký tài khoản
    ├── admin.html                    # Cổng thông tin Quản trị viên hệ thống
    └── assets/
        ├── js/                       # Module JavaScript (camera.js, config.js, search.js, main.js...)
        ├── data/                     # herbs.js (Dữ liệu cây thuốc ngoại tuyến dự phòng)
        └── images/                   # Hình ảnh mẫu thử nhanh, ảnh nền và logo hệ thống
```

---

## 🔬 Các Thuật Toán Cốt Lõi Được Áp Dụng Trong Backend

1. **Thuật toán Tiền xử lý ảnh (Image Preprocessing)**:
   - **CLAHE (Contrast Limited Adaptive Histogram Equalization)**: Tách kênh độ sáng $L$ trong không gian màu $LAB$ để cân bằng biểu đồ tương phản thích ứng trước khi thay đổi kích thước, giúp làm rõ cấu trúc gân lá ngay cả khi chụp thiếu sáng hoặc ngược sáng.
   - **Bilinear/Bicubic Interpolation**: Chuẩn hóa kích thước đầu vào về $224 \times 224$ pixels.
   - **Z-Score Normalization**: Chuẩn hóa tensor ảnh theo trung bình và độ lệch chuẩn của bộ dữ liệu chuẩn ImageNet.

2. **Thuật toán Học sâu (Deep Learning)**:
   - **EfficientNet-B0**: Sử dụng mạng tích chập với cơ chế Compound Scaling cân bằng độ sâu, độ rộng và độ phân giải, kết hợp khối **MBConv (Inverted Residuals)** và **Squeeze-and-Excitation (SE)** trích xuất vector đặc trưng $1280$ chiều.
   - **CustomLeafCNN**: Mạng CNN sâu 5 khối tích chập chuẩn hóa tầng (Batch Normalization) và hàm kích hoạt phi tuyến tính ReLU, kết hợp Global Average Pooling để tránh Overfitting.
   - **Softmax Activation**: Tính toán phân phối xác suất dự đoán $16$ loài cây thuốc.

3. **Thuật toán Nhận diện tập mở OSR (Open-Set Recognition)**:
   - **MSP (Maximum Softmax Probability)**: Đánh giá độ tự tin phân loại cực đại.
   - **Cosine Similarity**: Đo góc định hướng giữa vector đặc trưng ảnh đầu vào với các vector tâm lớp nguyên mẫu (Prototypes).
   - **Euclidean Distance & Z-Score Anomaly Detection**: Tính toán khoảng cách không gian $L_2$ và độ lệch chuẩn thống kê để phát hiện các mẫu dị biệt nằm ngoài phân bố dữ liệu học.
   - **Multi-criteria Voting & Override**: Biểu quyết đa tiêu chí kết hợp ngưỡng áp đảo ($MSP \ge 98\%$) đảm bảo nhận diện chính xác ảnh hợp lệ và từ chối các đối tượng bất thường.

4. **Thuật toán Bảo mật & Hệ thống**:
   - **Bcrypt**: Băm mật khẩu một chiều có muối ngẫu nhiên (Salted Password Hashing).
   - **HMAC-SHA256**: Ký số và bảo mật JSON Web Token (JWT) cho các phiên giao dịch API.

---

## 💻 Hướng Dẫn Cài Đặt & Chạy Ứng Dụng (Localhost)

### 1. Khởi chạy Backend (FastAPI)
Yêu cầu: **Python 3.10 - 3.12** và **MySQL Server**.

```powershell
# 1. Di chuyển vào thư mục Backend
cd BE

# 2. Tạo và kích hoạt môi trường ảo Python
python -m venv venv
.\venv\Scripts\Activate.ps1

# 3. Cài đặt các thư viện phụ thuộc
pip install -r requirements.txt

# 4. Cấu hình file môi trường .env (kiểm tra tài khoản MySQL và khóa bí mật)
# Tham khảo file mẫu .env.example

# 5. Khởi động máy chủ Backend
python main.py
```
- **API Server:** `http://127.0.0.1:8000`
- **Tài liệu API tương tác (Swagger UI):** `http://127.0.0.1:8000/docs`

### 2. Khởi chạy Frontend
Yêu cầu: Bất kỳ Web Server tĩnh nào (ví dụ tiện ích **Live Server** trên VS Code hoặc Python HTTP Server).

```powershell
# Di chuyển vào thư mục Frontend
cd FE

# Chạy server tĩnh nhanh qua Python:
python -m http.server 5500
```
- Truy cập giao diện ứng dụng tại: `http://127.0.0.1:5500` (hoặc cổng Live Server `5500` / `5501`).

---

## 🌿 Danh Mục 16 Loài Cây Thuốc Trong Mô Hình

| STT | Tên Tiếng Việt | Tên Khoa Học | Mã Loài (Class ID) |
| :---: | :--- | :--- | :--- |
| 1 | **Nha đam (Lô hội)** | *Aloe vera* | `Aloe` |
| 2 | **Khổ qua (Mướp đắng)** | *Momordica charantia* | `Bitter Gourd` |
| 3 | **Rau má** | *Centella asiatica* | `Centella asiatica` |
| 4 | **Cà phê** | *Coffea arabica* | `Coffee` |
| 5 | **Nho** | *Vitis vinifera* | `Grape` |
| 6 | **Ổi** | *Psidium guajava* | `Guava` |
| 7 | **Râm bụt (Dâm bụt)** | *Hibiscus rosa-sinensis* | `Hibiscus` |
| 8 | **Mít** | *Artocarpus heterophyllus* | `Jackfruit` |
| 9 | **Chanh vàng** | *Citrus limon* | `Lemon` |
| 10 | **Xoài** | *Mangifera indica* | `Mango` |
| 11 | **Neem (Sầu đâu)** | *Azadirachta indica* | `Neem` |
| 12 | **Cam** | *Citrus sinensis* | `Orange` |
| 13 | **Đu đủ** | *Carica papaya* | `Papaya` |
| 14 | **Chè (Trà)** | *Camellia sinensis* | `Tea` |
| 15 | **Cà chua** | *Solanum lycopersicum* | `Tomato` |
| 16 | **Húng quế thánh (Tulsi)** | *Ocimum tenuiflorum* | `Tulsi` |

---

© 2026 HerbaPedia. Đồ án PBL4 - Khoa Công nghệ Thông tin, Đại học Bách khoa - Đại học Đà Nẵng.
