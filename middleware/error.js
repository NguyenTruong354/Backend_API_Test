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
    this.timestamp = new Date().toISOString();
  }
}

// Middleware xử lý các lỗi không tồn tại (404)
const notFound = (req, res, next) => {
  const error = new ApiError(
    `Không tìm thấy đường dẫn: ${req.originalUrl}`, 
    404,
    [{ message: 'Vui lòng kiểm tra lại URL của bạn' }]
  );
  next(error);
};

// Middleware xử lý lỗi chung
const errorHandler = (err, req, res, next) => {
  // Ghi log lỗi ra console (chỉ trong môi trường phát triển)
  console.error('Lỗi xuất hiện:', {
    message: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
    timestamp: new Date().toISOString()
  });

  // Xác định mã trạng thái và thông báo lỗi
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Lỗi máy chủ nội bộ';
  
  // Tạo phản hồi lỗi
  const errorResponse = {
    success: false,
    message,
    timestamp: new Date().toISOString(),
    path: req.path,
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
      message: e.message,
      value: e.value
    }));
    
    const error = new ApiError(
      'Dữ liệu không hợp lệ', 
      400, 
      errors
    );
    
    return next(error);
  }

  // Xử lý lỗi kết nối database
  if (err.name === 'SequelizeConnectionError') {
    return next(new ApiError(
      'Không thể kết nối đến cơ sở dữ liệu',
      503,
      [{ message: 'Vui lòng thử lại sau' }]
    ));
  }
  
  // Nếu không phải lỗi Sequelize, chuyển đến middleware xử lý lỗi tiếp theo
  next(err);
};

// Middleware xử lý lỗi JWT
const jwtErrorHandler = (err, req, res, next) => {
  if (err.name === 'JsonWebTokenError') {
    return next(new ApiError(
      'Token không hợp lệ',
      401,
      [{ message: 'Vui lòng đăng nhập lại' }]
    ));
  }
  
  if (err.name === 'TokenExpiredError') {
    return next(new ApiError(
      'Phiên đăng nhập đã hết hạn',
      401,
      [{ message: 'Vui lòng đăng nhập lại để tiếp tục' }]
    ));
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
