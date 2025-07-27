const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  getDashboardOverview,
  getBodyMetricsRadarData,
  getHealthTrends,
  getNutritionStats,
  updateDashboard,
  getCalendarData,
  getDateData
} = require('../controllers/dashboardController');

// @route   GET /api/dashboard/overview
// @desc    Lấy thống kê tổng quan dashboard
// @access  Private
router.get('/overview', protect, getDashboardOverview);

// @route   GET /api/dashboard/body-metrics
// @desc    Lấy dữ liệu radar chart (chỉ số cơ thể)
// @access  Private
router.get('/body-metrics', protect, getBodyMetricsRadarData);

// @route   GET /api/dashboard/health-trends
// @desc    Lấy dữ liệu line chart (xu hướng sức khỏe)
// @access  Private
router.get('/health-trends', protect, getHealthTrends);

// @route   GET /api/dashboard/nutrition-stats
// @desc    Lấy dữ liệu nutrition bar chart
// @access  Private
router.get('/nutrition-stats', protect, getNutritionStats);

// @route   POST /api/dashboard/update
// @desc    Cập nhật dashboard data hôm nay
// @access  Private
router.post('/update', protect, updateDashboard);

// @route   GET /api/dashboard/calendar
// @desc    Lấy dữ liệu calendar (ngày nào có data)
// @access  Private
router.get('/calendar', protect, getCalendarData);

// @route   GET /api/dashboard/date/:date
// @desc    Lấy dữ liệu cho ngày cụ thể
// @access  Private
router.get('/date/:date', protect, getDateData);

module.exports = router; 
