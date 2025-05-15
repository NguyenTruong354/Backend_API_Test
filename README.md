# Backend_API_Test

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

### 6. Logging
- Log info và error sẽ được ghi vào thư mục `logs/` (info.log, error.log)

---
