const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  calculateCalories,
  getCalculationHistory,
  getLatestCalculation,
  getCalculationById,
  deleteCalculation,
  getBMIStats
} = require('../controllers/calorieController');

// Tất cả routes đều cần authentication
router.use(protect);

// POST /api/calorie/calculate - Tính toán calo
router.post('/calculate', calculateCalories);

// GET /api/calorie/history - Lấy lịch sử tính toán
router.get('/history', getCalculationHistory);

// GET /api/calorie/latest - Lấy tính toán gần nhất
router.get('/latest', getLatestCalculation);

// GET /api/calorie/stats/bmi - Lấy thống kê BMI
router.get('/stats/bmi', getBMIStats);

// GET /api/calorie/:id - Lấy thông tin một tính toán
router.get('/:id', getCalculationById);

// DELETE /api/calorie/:id - Xóa tính toán
router.delete('/:id', deleteCalculation);

module.exports = router; 