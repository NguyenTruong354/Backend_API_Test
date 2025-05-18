# Backend_API_Test

## Mô tả dự án
Đây là dự án backend API mẫu sử dụng Node.js, Express, Sequelize (MySQL) để quản lý các thử thách (challenge) cho cộng đồng. Dự án hỗ trợ xác thực JWT, phân quyền, logging với Winston, cấu trúc rõ ràng theo mô hình service-repository-controller, dễ mở rộng và bảo trì.


## Cấu trúc thư mục
- `index.js`: Điểm khởi động ứng dụng
- `config/`: Cấu hình kết nối database, biến môi trường
- `controller/`: Xử lý logic cho các route, nhận request và trả response
- `middleware/`: Các middleware cho Express (xác thực, kiểm tra lỗi, ...)
- `models/`: Định nghĩa các schema/model cho database (Sequelize)
- `repositories/`: Xử lý truy vấn dữ liệu, giao tiếp với database
- `routes/`: Định nghĩa các endpoint API và ánh xạ tới controller
- `services/`: Chứa các logic nghiệp vụ, xử lý dữ liệu
- `utils/`: Các hàm tiện ích dùng chung, logger, constants
- `logs/`: Chứa file log info và error
- `docs/`: Chứa tài liệu OpenAPI (Swagger)

## Hướng dẫn cài đặt và chạy dự án

### 1. Clone dự án
```bash
git clone https://github.com/NguyenTruong354/Backend_API_Test.git
cd Backend_API_Test
```

### 2. Cài đặt các package cần thiết
```bash
npm install
```

### 3. Thiết lập cấu hình
- Tạo file `.env` ở thư mục gốc với nội dung ví dụ:
```
DB_NAME=data_apilothub
DB_USER=root
DB_PASSWORD=1234
DB_HOST=localhost
PORT=5000
JWT_SECRET=your_secret_key
```
- Đảm bảo đã tạo database và các bảng cần thiết trong MySQL.

### 4. Chạy dự án
```bash
npm start
```
Hoặc:
```bash
node index.js
```

### 5. Truy cập API
- Mặc định API sẽ chạy trên `http://localhost:5000`
- Một số endpoint mẫu:
  - `GET /api/challenges?userId=1` — Lấy danh sách challenge của user
  - `GET /api/challenges/:id?userId=1` — Lấy chi tiết 1 challenge
  - (Các endpoint khác xem trong thư mục `routes/`)
- API chạy swagger: `http://localhost:5000/api-docs`

### 6. Logging
- Log info và error sẽ được ghi vào thư mục `logs/` (info.log, error.log)

### 7. Tài liệu API (OpenAPI/Swagger)
- File tài liệu OpenAPI 3.0: `docs/openapi.yaml`
- Có thể sử dụng [Swagger Editor Online](https://editor.swagger.io/) để xem và thử API:
  1. Truy cập https://editor.swagger.io/
  2. Chọn "File" → "Import File" và chọn file `docs/openapi.yaml` trong dự án
  3. Xem chi tiết các endpoint, schema, response mẫu, thử API trực tiếp

---

