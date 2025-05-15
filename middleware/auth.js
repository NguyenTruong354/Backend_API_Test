const jwt = require('jsonwebtoken');
const sequelize = require('../config/database');
const { Sequelize, DataTypes } = require('sequelize');

// Kiểm tra nếu có người dùng với ID từ token JWT
async function getUserById(userId) {
  try {
    // Tạo truy vấn SQL trực tiếp 
    const [results] = await sequelize.query(
      'SELECT * FROM users WHERE id = :userId',
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
 */
const authenticate = async (req, res, next) => {
  try {
    // Lấy token từ header Authorization
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ 
        success: false, 
        message: 'Không tìm thấy token xác thực' 
      });
    }
    
    // Tách token từ chuỗi "Bearer [token]"
    const token = authHeader.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ 
        success: false, 
        message: 'Token không được cung cấp' 
      });
    }
    
    try {
      // Xác thực token với SECRET_KEY từ biến môi trường
      // Nếu không có biến môi trường, sử dụng khóa mặc định (chỉ dùng trong quá trình phát triển)
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'default_jwt_secret_key_for_development');
      
      // Tìm người dùng từ ID trong token
      const user = await getUserById(decoded.id);
      
      if (!user) {
        return res.status(401).json({ 
          success: false, 
          message: 'Người dùng không tồn tại' 
        });
      }
      
      // Gán thông tin người dùng vào đối tượng req để sử dụng trong các middleware/controller tiếp theo
      req.user = user;
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
          message: 'Token đã hết hạn' 
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
 * Kiểm tra xem người dùng đã xác thực có quyền admin hay không
 */
const authorizeAdmin = (req, res, next) => {
  // Đảm bảo người dùng đã được xác thực trước đó
  if (!req.user) {
    return res.status(401).json({ 
      success: false, 
      message: 'Yêu cầu xác thực trước khi kiểm tra quyền' 
    });
  }
  
  // Kiểm tra nếu người dùng có quyền admin
  if (req.user.role !== 'admin') {
    return res.status(403).json({ 
      success: false, 
      message: 'Không có quyền truy cập tài nguyên này' 
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
  return jwt.sign(
    { id: user.id, email: user.email },
    process.env.JWT_SECRET || 'default_jwt_secret_key_for_development',
    { expiresIn: '24h' } // Token hết hạn sau 24 giờ
  );
};

module.exports = {
  authenticate,
  authorizeAdmin,
  generateToken
};
