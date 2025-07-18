const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  createBodyMetrics,
  getBodyMetrics,
  updateBodyMetrics,
  deleteBodyMetrics,
  getBodyMetricsStats
} = require('../controllers/bodyMetricsController');

// Tất cả routes đều cần authentication
router.use(protect);

// POST /api/body-metrics - Tạo body metrics mới
router.post('/', createBodyMetrics);

// GET /api/body-metrics - Lấy body metrics của user
router.get('/', getBodyMetrics);

// GET /api/body-metrics/stats - Lấy thống kê body metrics
router.get('/stats', getBodyMetricsStats);

// PUT /api/body-metrics/:id - Cập nhật body metrics
router.put('/:id', updateBodyMetrics);

// DELETE /api/body-metrics/:id - Xóa body metrics
router.delete('/:id', deleteBodyMetrics);

module.exports = router; 