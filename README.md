# HerbaPedia

HerbaPedia là đồ án PBL4 về nhận diện lá dược liệu bằng deep learning, tra cứu thông tin dược liệu, lưu lịch sử nhận diện và chia sẻ kinh nghiệm trong cộng đồng. Frontend là HTML/CSS/Vanilla JavaScript; Backend sử dụng FastAPI, SQLAlchemy và MySQL/SQLite theo cấu hình.

Hệ thống hỗ trợ hai mô hình PyTorch cho **16 loài trong tập mô hình** và cơ chế Open-Set Recognition để hạn chế dự đoán sai với ảnh không thuộc danh mục.

## Nội dung

- [Chức năng](#chức-năng)
- [Kiến trúc](#kiến-trúc)
- [Công nghệ](#công-nghệ)
- [Luồng nhận diện](#luồng-nhận-diện)
- [Thuật toán chính](#thuật-toán-chính)
- [Chạy dự án local](#chạy-dự-án-local)
- [Biến môi trường](#biến-môi-trường)
- [Các nhóm API chính](#các-nhóm-api-chính)
- [Quy tắc hình ảnh](#quy-tắc-hình-ảnh)
- [Kiểm tra](#kiểm-tra)

## Chức năng

- Nhận diện lá bằng hai mô hình: EfficientNet-B0 hoặc CustomLeafCNN.
- Tải ảnh, dùng webcam hoặc nhận ảnh do camera thiết bị gửi lên.
- Kiểm tra chất lượng ảnh trước khi suy luận.
- Hỗ trợ từ chối ảnh ngoài 16 lớp bằng Open-Set Recognition.
- Tra cứu tên, tên khoa học, công dụng, cách dùng, hoạt chất và cảnh báo an toàn.
- Lưu lịch sử nhận diện cho người đã đăng nhập.
- Đăng ký, đăng nhập, Google OAuth, JWT, OTP khôi phục mật khẩu và đổi mật khẩu.
- Quản lý hồ sơ, avatar, bài viết cộng đồng, bình luận, lượt thích và thông báo.
- Quản trị người dùng, cây thuốc, bài viết cộng đồng và ảnh dược liệu.
- Phân trang cộng đồng và thống kê dược liệu được nhận diện nhiều nhất.

## Kiến trúc

```text
PBL4/
├── BE/
│   ├── main.py                 # Khởi tạo FastAPI, CORS, lifespan và API nhận diện
│   ├── database.py             # SQLAlchemy models và kết nối cơ sở dữ liệu
│   ├── herb_seed.json          # Dữ liệu khởi tạo cây thuốc
│   ├── routers/
│   │   ├── auth.py             # Tài khoản, JWT, OTP, avatar và lịch sử
│   │   ├── herbs.py            # Tra cứu, thống kê, quản lý dược liệu
│   │   └── community.py        # Bài viết, bình luận, thích và thông báo
│   └── services/
│       ├── leafai_models.py    # Kiến trúc mô hình và CLAHE
│       ├── model_service.py    # Nạp mô hình, tiền xử lý và OSR
│       ├── cloudinary_service.py
│       └── email_service.py
└── FE/
    ├── index.html
    ├── result.html
    ├── search.html
    ├── detail.html
    ├── profile.html
    ├── history.html
    ├── personal-history.html
    ├── user-profile.html
    ├── auth.html
    ├── admin.html
    └── assets/
        ├── js/
        ├── css/
        ├── data/herbs.js
        └── images/
```

## Công nghệ

| Tầng | Công nghệ |
|---|---|
| Frontend | HTML5, TailwindCSS, Vanilla JavaScript |
| Backend | Python 3.10-3.12, FastAPI, Uvicorn |
| Cơ sở dữ liệu | MySQL mặc định local; SQLAlchemy hỗ trợ SQLite/MySQL/PostgreSQL |
| AI | PyTorch, Torchvision, NumPy, OpenCV, Pillow |
| Xác thực | JWT HS256, bcrypt, Google OAuth |
| Lưu trữ ảnh | Cloudinary; ảnh local FE được dùng làm fallback |
| Email | SMTP qua môi trường cấu hình |

## Luồng nhận diện

1. FE gửi ảnh và tùy chọn mã mô hình đến `POST /predict`.
2. Backend kiểm tra MIME, kích thước file tối đa 10 MB và nội dung ảnh.
3. Backend kiểm tra kích thước, độ sáng và độ sắc nét.
4. Ảnh được đổi sang RGB, xử lý EXIF, áp dụng CLAHE và letterbox về `224x224`.
5. Tensor đầu vào được chuẩn hóa theo mean/std của ImageNet.
6. Mô hình được nạp vào RAM và chạy inference trong threadpool.
7. EfficientNet-B0 có thể dùng ba tiêu chí OSR; CustomLeafCNN hiện dùng ngưỡng MSP.
8. Nếu ảnh thuộc tập đã biết, hệ thống trả kết quả và lưu lịch sử nền cho người dùng đã đăng nhập.

## Thuật toán chính

| Nhóm | Thuật toán | Triển khai | Vai trò |
|---|---|---|---|
| Tiền xử lý | Kiểm tra kích thước/brightness/sharpness | [`validate_image_quality`](BE/services/model_service.py) | Từ chối ảnh không đủ điều kiện trước inference |
| Tiền xử lý | EXIF, RGB, letterbox | [`preprocess_leafai_image`](BE/services/model_service.py) | Đưa ảnh về tensor `224x224` mà không kéo méo |
| Tiền xử lý | CLAHE trong không gian LAB | [`apply_clahe_preprocessing`](BE/services/leafai_models.py) | Tăng tương phản cục bộ trên kênh sáng |
| Phân loại | EfficientNet-B0 + MBConv/SE | [`LeafAI_Model`](BE/services/leafai_models.py) | Trích embedding 1280 chiều và logits cho 16 lớp |
| Phân loại | CustomLeafCNN 5 khối | [`CustomLeafCNN`](BE/services/leafai_models.py) | Mô hình nhẹ hơn, `Dropout(p=0.5)` |
| Xác suất | Softmax và MSP | [`predict_open_set`](BE/services/leafai_models.py) | Chuyển logits thành xác suất và lấy độ tin cậy lớn nhất |
| OSR | Cosine với prototype | [`predict_open_set`](BE/services/leafai_models.py) | So sánh hướng embedding với tâm lớp đã biết |
| OSR | Euclidean + Z-score | [`predict_open_set`](BE/services/leafai_models.py) | Đo độ lệch embedding so với phân bố lớp |
| OSR | Majority vote 2/3 | [`predict_open_set`](BE/services/leafai_models.py) | Chấp nhận mẫu khi ít nhất 2 trong 3 tiêu chí đồng ý |
| Bảo mật | bcrypt | [`hash_password`](BE/routers/auth.py) | Băm mật khẩu một chiều kèm salt ngẫu nhiên |
| Bảo mật | JWT HS256 | [`create_access_token`](BE/routers/auth.py) | Ký và giới hạn thời hạn phiên đăng nhập |
| Bảo mật | OTP `secrets` | [`forgot_password_send_otp`](BE/routers/auth.py) | Tạo mã 6 số ngẫu nhiên có thời hạn |
| Tra cứu | Tìm kiếm ILIKE | [`list_herbs`](BE/routers/herbs.py) | Tìm theo tên, khoa học, slug, công dụng |
| Thống kê | GROUP BY | [`get_top_recognized_herbs`](BE/routers/herbs.py) | Xếp hạng dược liệu theo lịch sử nhận diện |
| Cộng đồng | Offset/limit | [`list_posts`](BE/routers/community.py) | Tải feed theo trang |

### Giải thích mô hình và OSR

EfficientNet-B0 trả về vector embedding 1280 chiều và logits của 16 lớp. Softmax chuyển logits thành xác suất:

```text
P(class_i) = exp(logit_i) / sum(exp(logit_j))
MSP = max(P(class_i))
```

MSP cao không bảo đảm ảnh thuộc danh mục. EfficientNet-B0 kết hợp ba tiêu chí:

- MSP phải đạt ngưỡng cấu hình.
- Cosine similarity giữa embedding ảnh và prototype phải đạt ngưỡng.
- Z-score khoảng cách Euclidean không vượt ngưỡng dị biệt.

Một mẫu được chấp nhận nếu ít nhất hai trong ba tiêu chí đồng ý. Nếu không đạt, kết quả là `UNKNOWN/-1` thay vì ép ảnh vào lớp gần nhất. CustomLeafCNN hiện sử dụng ngưỡng MSP riêng.

### Chú ý về thông số

Các giá trị accuracy trong cấu hình mô hình là kết quả huấn luyện/đánh giá được lưu trong dự án. Khi chạy demo, kết quả thực tế có thể khác tùy bộ dữ liệu, ảnh đầu vào và cấu hình OSR.

## Chạy dự án local

### Yêu cầu

- Python 3.10-3.12
- MySQL Server nếu dùng cấu hình mặc định
- Trình duyệt có webcam hoặc điện thoại truy cập mạng nội bộ
- VS Code Live Server hoặc Python HTTP server cho Frontend

### Backend

Từ thư mục gốc:

```powershell
cd BE
python -m venv venv
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
Copy-Item .env.example .env
python main.py
```

- API: `http://127.0.0.1:8000`
- Swagger: `http://127.0.0.1:8000/docs`

Trước khi chạy, cập nhật `DATABASE_URL` và các khóa trong `.env`.

### Frontend

Từ thư mục gốc:

```powershell
cd FE
python -m http.server 5500
```

Mở `http://127.0.0.1:5500`.

Frontend mặc định gọi Backend tại `http://127.0.0.1:8000`. Cấu hình nằm tại `FE/assets/js/config.js`.

## Biến môi trường

Các biến quan trọng trong `BE/.env.example`:

| Biến | Mục đích |
|---|---|
| `DATABASE_URL` | Chuỗi kết nối SQLAlchemy |
| `JWT_SECRET_KEY` | Ký JWT; phải thay bằng giá trị bí mật riêng |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | Thời hạn access token |
| `CORS_ORIGINS` | Danh sách origin được phép |
| `ADMIN_USERNAMES` | Tài khoản được gán quyền admin |
| `GOOGLE_CLIENT_ID` | Google OAuth |
| `CLOUDINARY_*` | Upload avatar, bài viết và lịch sử |
| `SMTP_*` | Gửi OTP khôi phục mật khẩu |
| `ENABLE_OSR` | Bật/tắt OSR trong cấu hình inference |

Không commit `.env`, mật khẩu database, JWT secret, khóa Cloudinary hoặc app password vào Git.

## Các nhóm API chính

| Nhóm | Endpoint chính | Chức năng |
|---|---|---|
| Nhận diện | `POST /predict` | Kiểm tra và nhận diện ảnh |
| Mô hình | `GET /models`, `POST /models/select` | Liệt kê/chọn mô hình |
| Tài khoản | `/auth/register`, `/auth/login`, `/auth/me` | Đăng ký, đăng nhập, hồ sơ |
| OTP | `/auth/forgot-password/*` | Gửi và xác thực OTP |
| Dược liệu | `/herbs`, `/herbs/{slug}`, `/herbs/top-recognized` | Tra cứu và thống kê |
| Cộng đồng | `/community/posts`, `/community/comments` | Bài viết, bình luận, thích |
| Quản trị | `/auth/users`, `/herbs/upload-image`, `/herbs/{slug}` | Quản lý tài khoản/dược liệu |

## Quy tắc hình ảnh

- Ảnh Cloudinary được ưu tiên.
- Ảnh local trong `FE/assets/images/` được lấy theo mapping của `FE/assets/data/herbs.js`.
- Ảnh không thuộc nguồn được phép sẽ dùng `assets/images/logo.png`.
- Avatar và ảnh bài viết cộng đồng chấp nhận Cloudinary hoặc đường dẫn local hợp lệ.
- Khi admin đổi ảnh dược liệu qua API, Frontend resolver sẽ đọc URL lưu trong dữ liệu backend trước khi dùng mapping local.
- Tối đa 10 ảnh cho một bài cộng đồng.

## Kiểm tra

Kiểm tra cú pháp Python:

```powershell
cd BE
python -m compileall -q .
```

Kiểm tra cú pháp JavaScript:

```powershell
Get-ChildItem FE\assets\js -Filter *.js | ForEach-Object {
    node --check $_.FullName
}
```

Kiểm tra Backend health:

```powershell
Invoke-RestMethod -Uri "http://127.0.0.1:8000/"
```

Trước khi bàn giao nên kiểm tra thêm luồng đăng ký/đăng nhập, đổi avatar, nhận diện ảnh hợp lệ/không thuộc danh mục, upload bài cộng đồng, bình luận, phân trang và quyền admin.

## Dữ liệu 16 loài mô hình

| STT | Tên hiển thị | Tên khoa học | Class ID |
|---:|---|---|---|
| 1 | Nha đam | *Aloe vera* | `Aloe` |
| 2 | Khổ qua | *Momordica charantia* | `Bitter Gourd` |
| 3 | Rau má | *Centella asiatica* | `Centella asiatica` |
| 4 | Cà phê | *Coffea arabica* | `Coffee` |
| 5 | Nho | *Vitis vinifera* | `Grape` |
| 6 | Ổi | *Psidium guajava* | `Guava` |
| 7 | Dâm bụt | *Hibiscus rosa-sinensis* | `Hibiscus` |
| 8 | Mít | *Artocarpus heterophyllus* | `Jackfruit` |
| 9 | Chanh vàng | *Citrus limon* | `Lemon` |
| 10 | Xoài | *Mangifera indica* | `Mango` |
| 11 | Sầu đâu | *Azadirachta indica* | `Neem` |
| 12 | Cam | *Citrus sinensis* | `Orange` |
| 13 | Đu đủ | *Carica papaya* | `Papaya` |
| 14 | Trà | *Camellia sinensis* | `Tea` |
| 15 | Cà chua | *Solanum lycopersicum* | `Tomato` |
| 16 | Húng quế thánh | *Ocimum tenuiflorum* | `Tulsi` |
