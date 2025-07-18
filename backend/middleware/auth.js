const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Bảo vệ routes
const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Lấy token từ header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Lấy thông tin user từ token
      req.user = await User.findById(decoded.id).select('-password');

      next();
    } catch (error) {
      console.error(error);
      return res.status(401).json({
        success: false,
        message: 'Không có quyền truy cập, token không hợp lệ'
      });
    }
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Không có quyền truy cập, không có token'
    });
  }
};

// Kiểm tra quyền admin
const admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    return res.status(403).json({
      success: false,
      message: 'Không có quyền truy cập, yêu cầu quyền admin'
    });
  }
};

// Tạo JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE
  });
};

module.exports = { protect, admin, generateToken }; 