const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  getAllFoods,
  searchFoods,
  getFoodById,
  createFood,
  updateFood,
  deleteFood,
  getCategories
} = require('../controllers/foodController');

// Public routes
router.get('/search', searchFoods);
router.get('/categories', getCategories);
router.get('/', getAllFoods);
router.get('/:id', getFoodById);

// Protected routes (require authentication)
router.use(protect);

// POST /api/food - Tạo food mới (admin only)
router.post('/', createFood);

// PUT /api/food/:id - Cập nhật food (admin only)
router.put('/:id', updateFood);

// DELETE /api/food/:id - Xóa food (admin only)
router.delete('/:id', deleteFood);

module.exports = router; 