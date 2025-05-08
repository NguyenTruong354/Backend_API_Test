# Hướng dẫn cài đặt và chạy dự án

## 1. Clone dự án

```bash
git clone https://github.com/your-username/backend_api.git
cd backend_api
```

## 2. Cài đặt các package cần thiết

```bash
npm install
```

## 3. Thiết lập cấu hình (nếu cần)

- Cập nhật các file cấu hình trong thư mục `config/` (nếu có yêu cầu riêng).

## 4. Chạy dự án

```bash
npm start
```
Hoặc:
```bash
node index.js
```

## 5. Truy cập API

- Mặc định API sẽ chạy trên `http://localhost:3000` (hoặc cổng được cấu hình).

---

Nếu cần thiết lập biến môi trường, hãy tạo file `.env` trong thư mục gốc và thêm các biến phù hợp.