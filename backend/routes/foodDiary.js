const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  addFoodEntry,
  getDiaryByDate,
  getDiaryByRange,
  updateFoodEntry,
  deleteFoodEntry,
  getNutritionStats,
  getPopularFoods
} = require('../controllers/foodDiaryController');

// Tất cả routes đều cần authentication
router.use(protect);

// POST /api/food-diary/entry - Thêm food vào diary
router.post('/entry', addFoodEntry);

// GET /api/food-diary/date/:date - Lấy diary theo ngày
router.get('/date/:date', getDiaryByDate);

// GET /api/food-diary/range - Lấy diary theo khoảng thời gian
router.get('/range', getDiaryByRange);

// GET /api/food-diary/stats - Lấy thống kê dinh dưỡng
router.get('/stats', getNutritionStats);

// GET /api/food-diary/popular - Lấy foods phổ biến
router.get('/popular', getPopularFoods);

// PUT /api/food-diary/entry/:id - Cập nhật food entry
router.put('/entry/:id', updateFoodEntry);

// DELETE /api/food-diary/entry/:id - Xóa food entry
router.delete('/entry/:id', deleteFoodEntry);

module.exports = router; 