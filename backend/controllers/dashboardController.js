const Dashboard = require('../models/Dashboard');
const HealthTrend = require('../models/HealthTrend');
const FoodDiary = require('../models/FoodDiary');
const CalorieCalculation = require('../models/CalorieCalculation');
const BodyMetrics = require('../models/BodyMetrics');

// @desc    Lấy thống kê tổng quan dashboard
// @route   GET /api/dashboard/overview
// @access  Private
const getDashboardOverview = async (req, res) => {
  try {
    const userId = req.user.id;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Lấy dashboard data hôm nay
    let todayDashboard = await Dashboard.findOne({
      userId,
      date: {
        $gte: today,
        $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000)
      }
    });

    // Nếu chưa có data hôm nay, tạo mới từ các nguồn khác
    if (!todayDashboard) {
      todayDashboard = await generateTodayDashboard(userId);
    }

    // Lấy calorie target gần nhất
    const latestCalorieCalc = await CalorieCalculation.findOne({ userId }).sort({ createdAt: -1 });

    // Lấy thống kê 7 ngày gần nhất
    const weeklyStats = await getWeeklyStats(userId);

    res.json({
      success: true,
      data: {
        today: todayDashboard,
        calorieTarget: latestCalorieCalc,
        weeklyStats,
        lastUpdated: new Date()
      }
    });
  } catch (error) {
    console.error('Get dashboard overview error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy thống kê dashboard'
    });
  }
};

// @desc    Lấy dữ liệu radar chart (chỉ số cơ thể)
// @route   GET /api/dashboard/body-metrics
// @access  Private
const getBodyMetricsRadarData = async (req, res) => {
  try {
    const userId = req.user.id;

    // Lấy body metrics gần nhất
    const latestBodyMetrics = await BodyMetrics.findOne({ userId }).sort({ createdAt: -1 });
    
    // Lấy calorie calculation gần nhất
    const latestCalorieCalc = await CalorieCalculation.findOne({ userId }).sort({ createdAt: -1 });

    // Lấy dashboard gần nhất để có health score
    const latestDashboard = await Dashboard.findOne({ userId }).sort({ createdAt: -1 });

    // Tính toán các chỉ số cho radar chart (scale 0-100)
    const radarData = {
      weight: calculateWeightScore(latestBodyMetrics?.weight, latestCalorieCalc?.bmi),
      height: 85, // Height không thay đổi nhiều, có thể set cố định
      bmi: calculateBMIScore(latestCalorieCalc?.bmi),
      age: calculateAgeScore(latestCalorieCalc?.age || 25),
      activity: calculateActivityScore(latestCalorieCalc?.activityLevel),
      health: latestDashboard?.scores?.overall || 70
    };

    res.json({
      success: true,
      data: {
        radarData,
        rawData: {
          bodyMetrics: latestBodyMetrics,
          calorieCalc: latestCalorieCalc,
          dashboard: latestDashboard
        }
      }
    });
  } catch (error) {
    console.error('Get body metrics radar data error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy dữ liệu chỉ số cơ thể'
    });
  }
};

// @desc    Lấy dữ liệu line chart (xu hướng theo thời gian)
// @route   GET /api/dashboard/health-trends
// @access  Private
const getHealthTrends = async (req, res) => {
  try {
    const userId = req.user.id;
    const { period = 'monthly', limit = 12 } = req.query;

    // Lấy health trends data
    let trendsData = await HealthTrend.getTrendData(userId, period, parseInt(limit));

    // Nếu chưa có data, generate từ existing data
    if (trendsData.length === 0) {
      trendsData = await generateHealthTrends(userId, period, parseInt(limit));
    }

    // Format data cho line chart
    const chartData = trendsData.reverse().map((trend, index) => {
      const date = new Date(trend.date);
      const monthNames = ['Th1', 'Th2', 'Th3', 'Th4', 'Th5', 'Th6', 'Th7', 'Th8', 'Th9', 'Th10', 'Th11', 'Th12'];
      
      return {
        month: period === 'monthly' ? monthNames[date.getMonth()] : `T${date.getDate()}`,
        value: trend.overallScore,
        date: trend.date,
        details: {
          weight: trend.healthMetrics.weight,
          bmi: trend.healthMetrics.bmi,
          bodyFat: trend.healthMetrics.bodyFatPercentage,
          goals: trend.goalAchievements
        }
      };
    });

    res.json({
      success: true,
      data: {
        chartData,
        period,
        trends: trendsData
      }
    });
  } catch (error) {
    console.error('Get health trends error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy dữ liệu xu hướng sức khỏe'
    });
  }
};

// @desc    Lấy dữ liệu nutrition bar chart
// @route   GET /api/dashboard/nutrition-stats
// @access  Private
const getNutritionStats = async (req, res) => {
  try {
    const userId = req.user.id;
    const { days = 7 } = req.query;

    // Lấy food diary data 7 ngày gần nhất
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(days));

    const nutritionData = await FoodDiary.aggregate([
      {
        $match: {
          userId: userId,
          date: {
            $gte: startDate,
            $lte: endDate
          }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$date" }
          },
          protein: { $sum: "$totalProtein" },
          carbs: { $sum: "$totalCarbs" },
          fat: { $sum: "$totalFat" },
          fiber: { $sum: "$totalFiber" },
          calories: { $sum: "$totalCalories" },
          date: { $first: "$date" }
        }
      },
      {
        $sort: { date: 1 }
      },
      {
        $limit: parseInt(days)
      }
    ]);

    // Format data cho bar chart
    const chartData = [];
    const dayNames = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
    
    for (let i = parseInt(days) - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      
      const existingData = nutritionData.find(item => 
        new Date(item.date).toDateString() === date.toDateString()
      );

      chartData.push({
        day: dayNames[date.getDay()],
        date: date.toISOString().split('T')[0],
        protein: existingData?.protein || 0,
        carbs: existingData?.carbs || 0,
        fat: existingData?.fat || 0,
        fiber: existingData?.fiber || 0,
        calories: existingData?.calories || 0
      });
    }

    res.json({
      success: true,
      data: {
        chartData,
        summary: {
          averageProtein: chartData.reduce((sum, day) => sum + day.protein, 0) / chartData.length,
          averageCarbs: chartData.reduce((sum, day) => sum + day.carbs, 0) / chartData.length,
          averageFat: chartData.reduce((sum, day) => sum + day.fat, 0) / chartData.length,
          averageFiber: chartData.reduce((sum, day) => sum + day.fiber, 0) / chartData.length,
          totalDays: chartData.length
        }
      }
    });
  } catch (error) {
    console.error('Get nutrition stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy thống kê dinh dưỡng'
    });
  }
};

// @desc    Cập nhật dashboard data hôm nay
// @route   POST /api/dashboard/update
// @access  Private
const updateDashboard = async (req, res) => {
  try {
    const userId = req.user.id;
    const updates = req.body;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Tìm hoặc tạo dashboard entry cho hôm nay
    let dashboard = await Dashboard.findOne({
      userId,
      date: {
        $gte: today,
        $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000)
      }
    });

    if (!dashboard) {
      dashboard = new Dashboard({
        userId,
        date: today,
        ...updates
      });
    } else {
      // Merge updates
      Object.keys(updates).forEach(key => {
        if (typeof updates[key] === 'object' && !Array.isArray(updates[key])) {
          dashboard[key] = { ...dashboard[key], ...updates[key] };
        } else {
          dashboard[key] = updates[key];
        }
      });
    }

    // Tính overall score
    dashboard.calculateOverallScore();
    
    await dashboard.save();

    res.json({
      success: true,
      data: dashboard,
      message: 'Cập nhật dashboard thành công'
    });
  } catch (error) {
    console.error('Update dashboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi cập nhật dashboard'
    });
  }
};

// Helper functions
const generateTodayDashboard = async (userId) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Lấy food diary hôm nay
  const todayDiary = await FoodDiary.findOne({
    userId,
    date: {
      $gte: today,
      $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000)
    }
  });

  // Lấy calorie target
  const calorieTarget = await CalorieCalculation.findOne({ userId }).sort({ createdAt: -1 });

  // Lấy body metrics
  const bodyMetrics = await BodyMetrics.findOne({ userId }).sort({ createdAt: -1 });

  const dashboard = new Dashboard({
    userId,
    date: today,
    stats: {
      totalCalories: todayDiary?.totalCalories || 0,
      targetCalories: calorieTarget?.targetCalories || 2000,
      totalProtein: todayDiary?.totalProtein || 0,
      totalCarbs: todayDiary?.totalCarbs || 0,
      totalFat: todayDiary?.totalFat || 0,
      totalFiber: todayDiary?.totalFiber || 0
    },
    bodyMetrics: {
      weight: bodyMetrics?.weight || calorieTarget?.weight || 70,
      height: bodyMetrics?.height || calorieTarget?.height || 170,
      bmi: calorieTarget?.bmi || 22,
      age: calorieTarget?.age || 25,
      activityLevel: calorieTarget?.activityLevel || 'moderately_active'
    }
  });

  await dashboard.save();
  return dashboard;
};

const getWeeklyStats = async (userId) => {
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - 7);

  const weeklyDashboards = await Dashboard.find({
    userId,
    date: { $gte: startDate, $lte: endDate }
  }).sort({ date: -1 });

  return {
    totalDays: weeklyDashboards.length,
    averageCalories: weeklyDashboards.reduce((sum, d) => sum + d.stats.totalCalories, 0) / Math.max(weeklyDashboards.length, 1),
    averageScore: weeklyDashboards.reduce((sum, d) => sum + d.scores.overall, 0) / Math.max(weeklyDashboards.length, 1)
  };
};

const generateHealthTrends = async (userId, period, limit) => {
  const trends = [];
  const now = new Date();

  for (let i = limit - 1; i >= 0; i--) {
    const date = new Date(now);
    if (period === 'monthly') {
      date.setMonth(date.getMonth() - i);
    } else {
      date.setDate(date.getDate() - i);
    }

    const trend = new HealthTrend({
      userId,
      period,
      date,
      overallScore: Math.floor(Math.random() * 30) + 60, // Random score 60-90
      healthMetrics: {
        weight: 70 + Math.random() * 10,
        bmi: 22 + Math.random() * 3,
        bodyFatPercentage: 15 + Math.random() * 10
      }
    });

    await trend.save();
    trends.push(trend);
  }

  return trends;
};

// Score calculation helpers
const calculateWeightScore = (weight, bmi) => {
  if (!weight || !bmi) return 70;
  
  // Dựa trên BMI để tính điểm weight
  if (bmi >= 18.5 && bmi <= 24.9) return 100;
  if (bmi >= 25 && bmi <= 29.9) return 80;
  if (bmi >= 30) return 60;
  return 70;
};

const calculateBMIScore = (bmi) => {
  if (!bmi) return 70;
  
  if (bmi >= 18.5 && bmi <= 24.9) return 100;
  if (bmi >= 25 && bmi <= 29.9) return 75;
  if (bmi >= 17 && bmi < 18.5) return 80;
  return 50;
};

const calculateAgeScore = (age) => {
  // Tuổi trẻ có điểm cao hơn
  if (age <= 25) return 90;
  if (age <= 35) return 85;
  if (age <= 45) return 80;
  if (age <= 55) return 75;
  return 70;
};

const calculateActivityScore = (activityLevel) => {
  const scores = {
    'sedentary': 40,
    'lightly_active': 60,
    'moderately_active': 80,
    'very_active': 90,
    'extremely_active': 100
  };
  return scores[activityLevel] || 60;
};

module.exports = {
  getDashboardOverview,
  getBodyMetricsRadarData,
  getHealthTrends,
  getNutritionStats,
  updateDashboard
}; 