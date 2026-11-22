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

## 🔬 Các Thuật Toán Quan Trọng và Vị Trí Trong Code

| Nhóm | Thuật toán | Vị trí triển khai | Vai trò |
|---|---|---|---|
| Tiền xử lý | CLAHE trên kênh L của LAB | [`apply_clahe_preprocessing`](BE/services/leafai_models.py#L262) | Tăng tương phản cục bộ nhưng giữ màu lá. |
| Tiền xử lý | EXIF, letterbox bicubic, ImageNet normalization | [`preprocess_leafai_image`](BE/services/model_service.py#L323) | Đưa ảnh về tensor `(1, 3, 224, 224)` mà không kéo méo tỷ lệ. |
| Tiền kiểm tra | Brightness, kích thước, Laplacian variance | [`validate_image_quality`](BE/services/model_service.py#L341) | Từ chối ảnh quá nhỏ, tối/sáng hoặc mờ trước inference. |
| Phân loại | EfficientNet-B0 + MBConv/SE | [`LeafAI_Model`](BE/services/leafai_models.py#L49) | Trích xuất embedding 1280 chiều và logits cho 16 lớp. |
| Phân loại | CustomLeafCNN 5 khối | [`CustomLeafCNN`](BE/services/leafai_models.py#L143) | Mô hình nhẹ hơn, dùng BatchNorm, ReLU, pooling và Dropout. |
| Xác suất | Softmax và MSP | [`predict_open_set`](BE/services/leafai_models.py#L79) | Chuyển logits thành xác suất và lấy độ tin cậy lớn nhất. |
| OSR | Cosine similarity với prototypes | [`predict_open_set`](BE/services/leafai_models.py#L96) | Kiểm tra embedding có gần tâm lớp đã biết hay không. |
| OSR | Euclidean distance + Z-score | [`predict_open_set`](BE/services/leafai_models.py#L101) | Phát hiện mẫu lệch khỏi phân bố khoảng cách của lớp. |
| OSR | Majority vote 2/3 tiêu chí | [`predict_open_set`](BE/services/leafai_models.py#L108) | Chỉ chấp nhận ảnh khi ít nhất hai tín hiệu đồng thuận. |
| Bảo mật | Bcrypt password hashing | [`hash_password`](BE/routers/auth.py#L222) | Hash một chiều, salt ngẫu nhiên, không lưu mật khẩu gốc. |
| Bảo mật | JWT HS256 | [`create_access_token`](BE/routers/auth.py#L241) | Ký token có `sub` và thời hạn để xác thực API. |
| Bảo mật | OTP dùng `secrets` | [`forgot_password_send_otp`](BE/routers/auth.py#L579) | Sinh mã 6 số có thời hạn 15 phút và vô hiệu OTP cũ. |
| Tra cứu | ILIKE đa trường + lọc tag | [`list_herbs`](BE/routers/herbs.py#L91) | Tìm theo tên, tên khoa học, slug, công dụng và nhóm tác dụng. |
| Thống kê | GROUP BY lượt nhận diện | [`get_top_recognized_herbs`](BE/routers/herbs.py#L117) | Xếp hạng dược liệu phổ biến theo số lượt quét. |
| Cộng đồng | Phân trang offset/limit | [`list_posts`](BE/routers/community.py#L218) | Tải từng trang bài viết thay vì lấy toàn bộ feed một lần. |

### Giải thích nguyên lý hoạt động

#### 1. Tiền xử lý và kiểm tra chất lượng ảnh

Ảnh đầu vào được kiểm tra kích thước, độ sáng và độ sắc nét trước khi đưa vào mô hình. Ảnh quá nhỏ, quá tối/sáng hoặc bị mờ sẽ bị từ chối sớm để tránh tạo dự đoán không đáng tin cậy.

Sau đó, hệ thống đọc và xoay ảnh theo thông tin EXIF, chuyển ảnh về RGB, tăng tương phản bằng **CLAHE** trên kênh sáng `L` của không gian màu LAB. Ảnh được resize theo đúng tỷ lệ, thêm phần đệm (letterbox) để đạt kích thước `224x224`, rồi chuẩn hóa theo thống kê ImageNet. Cách này giữ hình dạng lá, không làm biến dạng ảnh khi kéo giãn.

#### 2. Hai mô hình phân loại

- **EfficientNet-B0** sử dụng các khối MBConv và cơ chế Squeeze-and-Excitation để tập trung vào đặc trưng quan trọng của lá. Mô hình trả về `logits` cho 16 lớp và vector embedding 1280 chiều.
- **CustomLeafCNN** gồm 5 khối tích chập. Mỗi khối sử dụng Convolution, BatchNorm, ReLU và Pooling để học dần từ cạnh, gân lá đến hình thái tổng thể. `Dropout(p=0.5)` giảm hiện tượng học thuộc dữ liệu và giúp mô hình nhẹ hơn.

`logits` là điểm số thô của từng lớp; lớp có điểm cao nhất là ứng viên ban đầu, nhưng chưa đủ để kết luận ảnh hợp lệ vì mô hình phân loại đóng luôn chọn một lớp kể cả khi ảnh không thuộc dữ liệu huấn luyện.

#### 3. Softmax và MSP

Softmax chuyển các `logits` thành phân phối xác suất:

```text
P(class_i) = exp(logit_i) / tổng(exp(logit_j))
MSP = max(P(class_i))
```

**MSP (Maximum Softmax Probability)** là xác suất lớn nhất trong 16 lớp. Nếu MSP thấp, mô hình không đủ tự tin. Tuy nhiên, MSP cao một mình vẫn có thể sai khi gặp ảnh ngoài danh mục, nên hệ thống kết hợp thêm hai tiêu chí OSR khác.

#### 4. Cosine Similarity với prototype

Mỗi lớp đã biết có một **prototype** đại diện cho embedding trung tâm của lớp đó. Hệ thống tính độ tương đồng cosine giữa embedding ảnh mới và prototype của lớp dự đoán:

```text
cosine(a, b) = (a · b) / (||a|| × ||b||)
```

Giá trị càng gần `1` nghĩa là hướng đặc trưng của ảnh càng giống lớp đã biết. Nếu embedding nằm quá xa prototype, ảnh có khả năng là đối tượng lạ dù Softmax vẫn cho xác suất cao.

#### 5. Euclidean Distance và Z-score

Khoảng cách Euclidean đo độ lệch của embedding ảnh so với prototype. Các khoảng cách tham chiếu của từng lớp được dùng để tính Z-score:

```text
Z = (distance - mean_distance) / standard_deviation
```

Z-score lớn cho biết ảnh lệch nhiều so với phân bố mẫu hợp lệ của lớp. Tiêu chí này bổ sung cho cosine: cosine xét hướng vector, còn Euclidean xét độ xa trong không gian đặc trưng.

#### 6. Quyết định Open-Set Recognition

Mỗi tiêu chí `MSP`, `Cosine Similarity` và `Z-score` tạo một tín hiệu chấp nhận hoặc từ chối. Cơ chế **majority vote** chỉ xác nhận ảnh thuộc 16 lớp khi có ít nhất **2 trên 3 tiêu chí** đồng ý. Nếu không đủ phiếu, hệ thống trả về trạng thái ngoài danh mục thay vì ép ảnh vào một lớp gần nhất.

#### 7. Các thuật toán nghiệp vụ khác

- **Bcrypt** băm mật khẩu một chiều kèm salt ngẫu nhiên; hệ thống không lưu mật khẩu gốc.
- **JWT HS256** tạo token có chữ ký và thời hạn. Mỗi API bảo vệ kiểm tra token trước khi cho phép truy cập.
- **OTP bằng `secrets`** tạo mã 6 chữ số khó đoán, có thời hạn 15 phút và vô hiệu mã cũ khi tạo mã mới.
- **Tìm kiếm ILIKE** tìm không phân biệt hoa thường trên nhiều trường như tên, tên khoa học, slug và công dụng, sau đó lọc thêm tag nếu có.
- **GROUP BY** đếm số lượt nhận diện theo từng dược liệu để tạo danh sách phổ biến.
- **Phân trang offset/limit** chỉ tải một phần bài viết mỗi lần, giảm dữ liệu trả về và thời gian hiển thị feed.

### Ghi chú đọc code

- Pipeline AI chạy theo thứ tự: kiểm tra chất lượng → EXIF/RGB → CLAHE → giữ tỷ lệ và padding → normalize → model.
- EfficientNet-B0 trả về `logits` và embedding; Softmax chỉ dùng để đo xác suất, còn OSR quyết định ảnh thuộc tập đã biết.
- OSR hiện **không** tự chấp nhận chỉ vì MSP cao. Ảnh cần đạt ít nhất 2/3 tiêu chí: MSP, cosine similarity và Z-score khoảng cách.
- `CustomLeafCNN` hiện dùng `Dropout(p=0.5)` trong [`CustomLeafCNN`](BE/services/leafai_models.py#L182), không phải `0.4`.
- Ảnh cộng đồng và ảnh đại diện được upload lên Cloudinary; FE chỉ hiển thị ảnh local hoặc URL Cloudinary hợp lệ, các nguồn ảnh khác dùng logo dự phòng.

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
