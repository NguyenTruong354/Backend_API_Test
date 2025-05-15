/**
 * Middleware quản lý và xử lý lỗi toàn cục
 * Cung cấp cách xử lý lỗi nhất quán trong toàn bộ ứng dụng
 */

// Lớp lỗi tùy chỉnh để các lỗi có thể có mã trạng thái và thông tin bổ sung
class ApiError extends Error {
  constructor(message, statusCode, errors = []) {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors;
    this.success = false;
  }
}

// Middleware xử lý các lỗi không tồn tại (404)
const notFound = (req, res, next) => {
  const error = new ApiError(`Không tìm thấy đường dẫn: ${req.originalUrl}`, 404);
  next(error);
};

// Middleware xử lý lỗi chung
const errorHandler = (err, req, res, next) => {
  // Ghi log lỗi ra console (chỉ trong môi trường phát triển)
  console.error('Lỗi xuất hiện:', err);

  // Xác định mã trạng thái và thông báo lỗi
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Lỗi máy chủ nội bộ';
  
  // Tạo phản hồi lỗi
  const errorResponse = {
    success: false,
    message,
    // Chỉ hiển thị ngăn xếp lỗi trong môi trường phát triển
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    // Thêm danh sách lỗi chi tiết nếu có
    ...(err.errors && err.errors.length > 0 && { errors: err.errors }),
  };

  // Phản hồi lỗi cho client
  res.status(statusCode).json(errorResponse);
};

// Xử lý lỗi Sequelize
const sequelizeErrorHandler = (err, req, res, next) => {
  // Kiểm tra nếu là lỗi Sequelize
  if (err.name === 'SequelizeValidationError' || err.name === 'SequelizeUniqueConstraintError') {
    const errors = err.errors.map(e => ({
      field: e.path,
      message: e.message
    }));
    
    const error = new ApiError(
      'Lỗi xác thực dữ liệu', 
      400, 
      errors
    );
    
    return next(error);
  }
  
  // Nếu không phải lỗi Sequelize, chuyển đến middleware xử lý lỗi tiếp theo
  next(err);
};

// Middleware xử lý lỗi JWT
const jwtErrorHandler = (err, req, res, next) => {
  if (err.name === 'JsonWebTokenError') {
    return next(new ApiError('Token không hợp lệ', 401));
  }
  
  if (err.name === 'TokenExpiredError') {
    return next(new ApiError('Token đã hết hạn', 401));
  }
  
  next(err);
};

module.exports = {
  ApiError,
  notFound,
  errorHandler,
  sequelizeErrorHandler,
  jwtErrorHandler
};
