const BodyMetrics = require('../models/BodyMetrics');

// Utility function để tính toán BMI và các chỉ số
const calculateMetrics = (height, weight, age, gender, activityLevel) => {
  const heightInMeters = height / 100;
  const bmi = weight / (heightInMeters * heightInMeters);

  // Tính BMR (Basal Metabolic Rate)
  let bmr;
  if (gender === 'male') {
    bmr = 88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * age);
  } else {
    bmr = 447.593 + (9.247 * weight) + (3.098 * height) - (4.330 * age);
  }

  // Tính calo hàng ngày dựa trên mức độ hoạt động
  const activityMultipliers = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    active: 1.725,
    veryActive: 1.9
  };

  const dailyCalories = bmr * activityMultipliers[activityLevel];

  // Phân loại BMI
  let bmiCategory = '';
  if (bmi < 18.5) {
    bmiCategory = 'Thiếu cân';
  } else if (bmi < 25) {
    bmiCategory = 'Bình thường';
  } else if (bmi < 30) {
    bmiCategory = 'Thừa cân';
  } else {
    bmiCategory = 'Béo phì';
  }

  // Tính cân nặng lý tưởng
  const idealWeightMin = 18.5 * (heightInMeters * heightInMeters);
  const idealWeightMax = 24.9 * (heightInMeters * heightInMeters);

  return {
    bmi: Math.round(bmi * 10) / 10,
    bmiCategory,
    bmr: Math.round(bmr),
    dailyCalories: Math.round(dailyCalories),
    idealWeightMin: Math.round(idealWeightMin),
    idealWeightMax: Math.round(idealWeightMax)
  };
};

// Tạo body metrics mới
const createBodyMetrics = async (req, res) => {
  try {
    const { height, weight, age, gender, activityLevel, notes } = req.body;

    // Validation
    if (!height || !weight || !age || !gender || !activityLevel) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng điền đầy đủ thông tin cần thiết'
      });
    }

    // Validate ranges
    if (height < 50 || height > 300) {
      return res.status(400).json({
        success: false,
        message: 'Chiều cao phải từ 50cm đến 300cm'
      });
    }

    if (weight < 10 || weight > 500) {
      return res.status(400).json({
        success: false,
        message: 'Cân nặng phải từ 10kg đến 500kg'
      });
    }

    if (age < 1 || age > 150) {
      return res.status(400).json({
        success: false,
        message: 'Tuổi phải từ 1 đến 150'
      });
    }

    // Tính toán các chỉ số
    const metrics = calculateMetrics(height, weight, age, gender, activityLevel);

    // Lưu vào database
    const bodyMetrics = new BodyMetrics({
      user: req.user.id,
      height,
      weight,
      age,
      gender,
      activityLevel,
      ...metrics,
      notes: notes || ''
    });

    await bodyMetrics.save();

    res.status(201).json({
      success: true,
      message: 'Tạo body metrics thành công',
      data: bodyMetrics
    });
  } catch (error) {
    console.error('Create body metrics error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi tạo body metrics'
    });
  }
};

// Lấy body metrics của user
const getBodyMetrics = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    const metrics = await BodyMetrics.find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await BodyMetrics.countDocuments({ user: req.user.id });

    res.json({
      success: true,
      data: {
        metrics,
        pagination: {
          current: parseInt(page),
          pages: Math.ceil(total / limit),
          total
        }
      }
    });
  } catch (error) {
    console.error('Get body metrics error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi lấy body metrics'
    });
  }
};

// Cập nhật body metrics
const updateBodyMetrics = async (req, res) => {
  try {
    const { id } = req.params;
    const { height, weight, age, gender, activityLevel, notes } = req.body;

    const metrics = await BodyMetrics.findOne({ _id: id, user: req.user.id });
    if (!metrics) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy body metrics'
      });
    }

    // Validation
    if (!height || !weight || !age || !gender || !activityLevel) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng điền đầy đủ thông tin cần thiết'
      });
    }

    // Tính toán lại các chỉ số
    const calculatedMetrics = calculateMetrics(height, weight, age, gender, activityLevel);

    // Cập nhật
    Object.assign(metrics, {
      height,
      weight,
      age,
      gender,
      activityLevel,
      ...calculatedMetrics,
      notes: notes || ''
    });

    await metrics.save();

    res.json({
      success: true,
      message: 'Cập nhật body metrics thành công',
      data: metrics
    });
  } catch (error) {
    console.error('Update body metrics error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi cập nhật body metrics'
    });
  }
};

// Xóa body metrics
const deleteBodyMetrics = async (req, res) => {
  try {
    const { id } = req.params;

    const metrics = await BodyMetrics.findOne({ _id: id, user: req.user.id });
    if (!metrics) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy body metrics'
      });
    }

    await BodyMetrics.findByIdAndDelete(id);

    res.json({
      success: true,
      message: 'Xóa body metrics thành công'
    });
  } catch (error) {
    console.error('Delete body metrics error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi xóa body metrics'
    });
  }
};

// Lấy thống kê body metrics
const getBodyMetricsStats = async (req, res) => {
  try {
    const { period = '30' } = req.query; // 30 days by default
    const daysBack = parseInt(period);
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - daysBack);

    const metrics = await BodyMetrics.find({
      user: req.user.id,
      createdAt: { $gte: startDate }
    }).sort({ createdAt: 1 });

    // Tính toán xu hướng
    const weightTrend = metrics.map(m => ({
      date: m.createdAt,
      weight: m.weight,
      bmi: m.bmi
    }));

    // Tính trung bình
    const avgWeight = metrics.reduce((sum, m) => sum + m.weight, 0) / metrics.length || 0;
    const avgBMI = metrics.reduce((sum, m) => sum + m.bmi, 0) / metrics.length || 0;

    res.json({
      success: true,
      data: {
        period: daysBack,
        totalRecords: metrics.length,
        weightTrend,
        averages: {
          weight: Math.round(avgWeight * 10) / 10,
          bmi: Math.round(avgBMI * 10) / 10
        },
        latest: metrics[metrics.length - 1] || null
      }
    });
  } catch (error) {
    console.error('Get body metrics stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi lấy thống kê body metrics'
    });
  }
};

module.exports = {
  createBodyMetrics,
  getBodyMetrics,
  updateBodyMetrics,
  deleteBodyMetrics,
  getBodyMetricsStats,
  // Legacy aliases for backward compatibility
  calculateAndSaveMetrics: createBodyMetrics,
  getMetricsHistory: getBodyMetrics,
  deleteMetrics: deleteBodyMetrics,
  getMetricsStats: getBodyMetricsStats
}; 