const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  getAllMealSuggestions,
  getMealSuggestionById,
  getMealSuggestionsByCalories,
  searchMealSuggestions,
  createMealSuggestion,
  updateMealSuggestion,
  deleteMealSuggestion,
  toggleLikeMealSuggestion,
  getPopularMealSuggestions
} = require('../controllers/mealSuggestionController');

// Public routes
router.get('/search', searchMealSuggestions);
router.get('/popular', getPopularMealSuggestions);
router.get('/by-calories', getMealSuggestionsByCalories);
router.get('/', getAllMealSuggestions);
router.get('/:id', getMealSuggestionById);

// Protected routes (require authentication)
router.use(protect);

// POST /api/meal-suggestions - Tạo gợi ý món ăn mới
router.post('/', createMealSuggestion);

// PUT /api/meal-suggestions/:id - Cập nhật gợi ý món ăn
router.put('/:id', updateMealSuggestion);

// DELETE /api/meal-suggestions/:id - Xóa gợi ý món ăn
router.delete('/:id', deleteMealSuggestion);

// POST /api/meal-suggestions/:id/like - Like/Unlike món ăn
router.post('/:id/like', toggleLikeMealSuggestion);

module.exports = router; 