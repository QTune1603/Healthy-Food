const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  getAddresses,
  createAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress
} = require('../controllers/addressController');

// Tất cả routes đều cần authentication
router.use(protect);

// GET /api/address - Lấy tất cả địa chỉ của user
router.get('/', getAddresses);

// POST /api/address - Tạo địa chỉ mới
router.post('/', createAddress);

// PUT /api/address/:id - Cập nhật địa chỉ
router.put('/:id', updateAddress);

// DELETE /api/address/:id - Xóa địa chỉ
router.delete('/:id', deleteAddress);

// PUT /api/address/:id/default - Đặt địa chỉ mặc định
router.put('/:id/default', setDefaultAddress);

module.exports = router; 