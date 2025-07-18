const CalorieCalculation = require('../models/CalorieCalculation');

// Utility function để tính toán calo
const calculateCalorieNeeds = (height, weight, age, gender, activityLevel, goal) => {
  // Calculate BMR using Mifflin-St Jeor Equation
  let bmr;
  if (gender === 'male') {
    bmr = 10 * weight + 6.25 * height - 5 * age + 5;
  } else {
    bmr = 10 * weight + 6.25 * height - 5 * age - 161;
  }

  // Activity level multipliers
  const activityMultipliers = {
    sedentary: 1.2,      // Ít vận động (ngồi nhiều)
    light: 1.375,        // Vận động nhẹ (1-3 ngày/tuần)
    moderate: 1.55,      // Vận động vừa (3-5 ngày/tuần)
    active: 1.725,       // Vận động nhiều (6-7 ngày/tuần)
    veryActive: 1.9      // Vận động rất nhiều (2 lần/ngày)
  };

  const maintenanceCalories = bmr * activityMultipliers[activityLevel];

  // Goal adjustments
  let targetCalories = maintenanceCalories;
  let goalDescription = '';
  
  switch (goal) {
    case 'lose':
      targetCalories = maintenanceCalories - 500; // 0.5kg per week
      goalDescription = 'Giảm cân (0.5kg/tuần)';
      break;
    case 'gain':
      targetCalories = maintenanceCalories + 500; // 0.5kg per week
      goalDescription = 'Tăng cân (0.5kg/tuần)';
      break;
    default:
      goalDescription = 'Duy trì cân nặng';
  }

  // Macronutrient breakdown (example ratios)
  const protein = (targetCalories * 0.25) / 4; // 25% protein, 4 cal/g
  const carbs = (targetCalories * 0.45) / 4;   // 45% carbs, 4 cal/g
  const fats = (targetCalories * 0.30) / 9;    // 30% fats, 9 cal/g

  return {
    bmr: Math.round(bmr),
    maintenanceCalories: Math.round(maintenanceCalories),
    targetCalories: Math.round(targetCalories),
    goalDescription,
    protein: Math.round(protein),
    carbs: Math.round(carbs),
    fats: Math.round(fats)
  };
};

// Tính toán calo và lưu vào database
const calculateCalories = async (req, res) => {
  try {
    const { height, weight, age, gender, activityLevel, goal } = req.body;

    // Validation
    if (!height || !weight || !age || !gender || !activityLevel || !goal) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng điền đầy đủ thông tin'
      });
    }

    // Validate ranges
    if (height < 50 || height > 300) {
      return res.status(400).json({
        success: false,
        message: 'Chiều cao phải từ 50-300cm'
      });
    }

    if (weight < 20 || weight > 500) {
      return res.status(400).json({
        success: false,
        message: 'Cân nặng phải từ 20-500kg'
      });
    }

    if (age < 1 || age > 120) {
      return res.status(400).json({
        success: false,
        message: 'Tuổi phải từ 1-120'
      });
    }

    // Calculate calories
    const results = calculateCalorieNeeds(
      parseFloat(height),
      parseFloat(weight),
      parseFloat(age),
      gender,
      activityLevel,
      goal
    );

    // Save to database
    const calculation = new CalorieCalculation({
      user: req.user.id,
      height: parseFloat(height),
      weight: parseFloat(weight),
      age: parseFloat(age),
      gender,
      activityLevel,
      goal,
      ...results
    });

    await calculation.save();

    res.json({
      success: true,
      message: 'Tính toán calo thành công',
      data: {
        id: calculation._id,
        ...results,
        bmi: calculation.bmi,
        bmiCategory: calculation.bmiCategory
      }
    });
  } catch (error) {
    console.error('Calculate calories error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi tính toán calo'
    });
  }
};

// Lấy lịch sử tính toán calo
const getCalculationHistory = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    const calculations = await CalorieCalculation.find({
      user: req.user.id,
      isActive: true
    })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit))
    .select('-user');

    const total = await CalorieCalculation.countDocuments({
      user: req.user.id,
      isActive: true
    });

    res.json({
      success: true,
      data: {
        calculations,
        pagination: {
          current: parseInt(page),
          pages: Math.ceil(total / limit),
          total
        }
      }
    });
  } catch (error) {
    console.error('Get calculation history error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi lấy lịch sử tính toán'
    });
  }
};

// Lấy tính toán gần nhất
const getLatestCalculation = async (req, res) => {
  try {
    const calculation = await CalorieCalculation.findOne({
      user: req.user.id,
      isActive: true
    })
    .sort({ createdAt: -1 })
    .select('-user');

    if (!calculation) {
      return res.json({
        success: true,
        data: null,
        message: 'Chưa có lịch sử tính toán'
      });
    }

    res.json({
      success: true,
      data: calculation
    });
  } catch (error) {
    console.error('Get latest calculation error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi lấy tính toán gần nhất'
    });
  }
};

// Lấy thông tin một tính toán cụ thể
const getCalculationById = async (req, res) => {
  try {
    const { id } = req.params;

    const calculation = await CalorieCalculation.findOne({
      _id: id,
      user: req.user.id,
      isActive: true
    }).select('-user');

    if (!calculation) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy tính toán'
      });
    }

    res.json({
      success: true,
      data: calculation
    });
  } catch (error) {
    console.error('Get calculation by id error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi lấy thông tin tính toán'
    });
  }
};

// Xóa tính toán
const deleteCalculation = async (req, res) => {
  try {
    const { id } = req.params;

    const calculation = await CalorieCalculation.findOneAndUpdate(
      {
        _id: id,
        user: req.user.id
      },
      { isActive: false },
      { new: true }
    );

    if (!calculation) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy tính toán'
      });
    }

    res.json({
      success: true,
      message: 'Xóa tính toán thành công'
    });
  } catch (error) {
    console.error('Delete calculation error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi xóa tính toán'
    });
  }
};

// Lấy thống kê BMI theo thời gian
const getBMIStats = async (req, res) => {
  try {
    const { period = 30 } = req.query; // 30 days by default
    const daysBack = parseInt(period);
    
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - daysBack);

    const calculations = await CalorieCalculation.find({
      user: req.user.id,
      isActive: true,
      createdAt: { $gte: startDate }
    })
    .sort({ createdAt: 1 })
    .select('bmi bmiCategory weight createdAt');

    // Tính thống kê
    const stats = {
      totalCalculations: calculations.length,
      averageBMI: 0,
      currentBMI: 0,
      bmiTrend: 'stable', // up, down, stable
      weightChange: 0,
      bmiHistory: calculations.map(calc => ({
        date: calc.createdAt,
        bmi: calc.bmi,
        weight: calc.weight,
        category: calc.bmiCategory
      }))
    };

    if (calculations.length > 0) {
      stats.averageBMI = Math.round(
        (calculations.reduce((sum, calc) => sum + calc.bmi, 0) / calculations.length) * 10
      ) / 10;
      
      stats.currentBMI = calculations[calculations.length - 1].bmi;
      
      if (calculations.length > 1) {
        const firstWeight = calculations[0].weight;
        const lastWeight = calculations[calculations.length - 1].weight;
        stats.weightChange = Math.round((lastWeight - firstWeight) * 10) / 10;
        
        const firstBMI = calculations[0].bmi;
        const lastBMI = calculations[calculations.length - 1].bmi;
        
        if (lastBMI > firstBMI + 0.5) {
          stats.bmiTrend = 'up';
        } else if (lastBMI < firstBMI - 0.5) {
          stats.bmiTrend = 'down';
        }
      }
    }

    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Get BMI stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi lấy thống kê BMI'
    });
  }
};

module.exports = {
  calculateCalories,
  getCalculationHistory,
  getLatestCalculation,
  getCalculationById,
  deleteCalculation,
  getBMIStats
}; 