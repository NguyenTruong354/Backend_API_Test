const jwt = require('jsonwebtoken');
const sequelize = require('../config/database');
const { Sequelize, DataTypes } = require('sequelize');

/**
 * Hàm lấy thông tin người dùng theo ID
 * @param {number} userId - ID của người dùng cần tìm
 * @returns {Object|null} - Thông tin người dùng hoặc null nếu không tìm thấy
 */
async function getUserById(userId) {
  try {
    const [results] = await sequelize.query(
      'SELECT * FROM users WHERE id = :userId AND is_active = true',
      {
        replacements: { userId },
        type: Sequelize.QueryTypes.SELECT
      }
    );
    return results;
  } catch (error) {
    console.error('Lỗi khi tìm người dùng:', error);
    return null;
  }
}

/**
 * Middleware xác thực người dùng
 * Kiểm tra và xác thực JWT token từ header 'Authorization'
 * Thêm kiểm tra trạng thái active của người dùng
 */
const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ 
        success: false, 
        message: 'Không tìm thấy token xác thực' 
      });
    }
    
    const token = authHeader.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ 
        success: false, 
        message: 'Token không được cung cấp' 
      });
    }
    
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'default_jwt_secret_key_for_development');
      const user = await getUserById(decoded.id);
      
      if (!user) {
        return res.status(401).json({ 
          success: false, 
          message: 'Tài khoản không tồn tại hoặc đã bị vô hiệu hóa' 
        });
      }

      // Kiểm tra nếu tài khoản bị khóa
      if (!user.is_active) {
        return res.status(403).json({
          success: false,
          message: 'Tài khoản của bạn đã bị khóa'
        });
      }
      
      // Thêm thông tin bảo mật vào user object
      const sanitizedUser = {
        id: user.id,
        email: user.email,
        role: user.role,
        is_active: user.is_active,
        last_login: user.last_login
      };
      
      req.user = sanitizedUser;
      next();
    } catch (error) {
      if (error instanceof jwt.JsonWebTokenError) {
        return res.status(401).json({ 
          success: false, 
          message: 'Token không hợp lệ' 
        });
      } else if (error instanceof jwt.TokenExpiredError) {
        return res.status(401).json({ 
          success: false, 
          message: 'Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại' 
        });
      } else {
        return res.status(500).json({ 
          success: false, 
          message: 'Lỗi xác thực: ' + error.message 
        });
      }
    }
  } catch (error) {
    console.error('Lỗi xác thực:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Lỗi máy chủ khi xác thực' 
    });
  }
};

/**
 * Middleware xác thực quyền admin
 * Kiểm tra chi tiết các quyền của người dùng
 */
const authorizeAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ 
      success: false, 
      message: 'Yêu cầu xác thực trước khi kiểm tra quyền' 
    });
  }
  
  // Kiểm tra chi tiết các quyền
  if (req.user.role !== 'admin') {
    return res.status(403).json({ 
      success: false, 
      message: 'Bạn không có quyền truy cập tài nguyên này' 
    });
  }

  // Kiểm tra trạng thái tài khoản
  if (!req.user.is_active) {
    return res.status(403).json({
      success: false,
      message: 'Tài khoản của bạn đã bị khóa'
    });
  }
  
  next();
};

/**
 * Tạo JWT token cho người dùng
 * @param {Object} user - Đối tượng chứa thông tin người dùng
 * @returns {String} - JWT token
 */
const generateToken = (user) => {
  // Thêm các thông tin bảo mật vào payload
  const payload = {
    id: user.id,
    email: user.email,
    role: user.role,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60) // 24 giờ
  };

  return jwt.sign(
    payload,
    process.env.JWT_SECRET || 'default_jwt_secret_key_for_development',
    { 
      expiresIn: '24h',
      algorithm: 'HS256'
    }
  );
};

module.exports = {
  authenticate,
  authorizeAdmin,
  generateToken
};
