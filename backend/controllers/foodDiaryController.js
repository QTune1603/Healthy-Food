const FoodDiary = require('../models/FoodDiary');
const Food = require('../models/Food');

// Utility function để tính toán dinh dưỡng
const calculateNutrition = (food, quantity) => {
  const multiplier = quantity / 100; // Vì dữ liệu lưu theo 100g
  
  return {
    calories: Math.round(food.caloriesPer100g * multiplier),
    protein: Math.round(food.protein * multiplier * 10) / 10,
    carbs: Math.round(food.carbs * multiplier * 10) / 10,
    fat: Math.round(food.fat * multiplier * 10) / 10
  };
};

// Thêm thực phẩm vào nhật ký
const addFoodEntry = async (req, res) => {
  try {
    const { foodId, quantity, unit, mealType, date } = req.body;

    // Validation
    if (!foodId || !quantity || !mealType || !date) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng điền đầy đủ thông tin'
      });
    }

    // Lấy thông tin thực phẩm
    const food = await Food.findById(foodId);
    if (!food) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy thực phẩm'
      });
    }

    // Tính toán dinh dưỡng
    const nutrition = calculateNutrition(food, quantity);

    // Tạo entry mới
    const newEntry = {
      food: foodId,
      foodName: food.name,
      quantity,
      unit: unit || food.unit,
      mealType,
      ...nutrition
    };

    // Tìm hoặc tạo diary cho ngày đó
    const entryDate = new Date(date);
    entryDate.setHours(0, 0, 0, 0);

    let diary = await FoodDiary.findOne({
      user: req.user.id,
      date: entryDate
    });

    if (!diary) {
      diary = new FoodDiary({
        user: req.user.id,
        date: entryDate,
        entries: [newEntry]
      });
    } else {
      diary.entries.push(newEntry);
    }

    await diary.save();

    res.status(201).json({
      success: true,
      message: 'Thêm thực phẩm vào nhật ký thành công',
      data: diary
    });
  } catch (error) {
    console.error('Add food entry error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi thêm thực phẩm vào nhật ký'
    });
  }
};

// Lấy nhật ký theo ngày
const getDiaryByDate = async (req, res) => {
  try {
    const { date } = req.params;
    
    const queryDate = new Date(date);
    queryDate.setHours(0, 0, 0, 0);

    const diary = await FoodDiary.findOne({
      user: req.user.id,
      date: queryDate
    }).populate('entries.food', 'name category unit');

    if (!diary) {
      return res.json({
        success: true,
        data: {
          date: queryDate,
          entries: [],
          totalCalories: 0,
          totalProtein: 0,
          totalCarbs: 0,
          totalFat: 0
        }
      });
    }

    res.json({
      success: true,
      data: diary
    });
  } catch (error) {
    console.error('Get diary by date error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi lấy nhật ký theo ngày'
    });
  }
};

// Lấy nhật ký theo khoảng thời gian
const getDiaryByRange = async (req, res) => {
  try {
    const { startDate, endDate, page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    let query = { user: req.user.id };

    if (startDate && endDate) {
      const start = new Date(startDate);
      start.setHours(0, 0, 0, 0);
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      
      query.date = { $gte: start, $lte: end };
    }

    const diaries = await FoodDiary.find(query)
      .sort({ date: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .populate('entries.food', 'name category unit');

    const total = await FoodDiary.countDocuments(query);

    res.json({
      success: true,
      data: {
        diaries,
        pagination: {
          current: parseInt(page),
          pages: Math.ceil(total / limit),
          total
        }
      }
    });
  } catch (error) {
    console.error('Get diary by range error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi lấy nhật ký theo khoảng thời gian'
    });
  }
};

// Cập nhật entry trong nhật ký
const updateFoodEntry = async (req, res) => {
  try {
    const { id } = req.params; // entryId từ route
    const { quantity, mealType } = req.body;

    // Tìm diary chứa entry với entryId và userId
    const diary = await FoodDiary.findOne({
      user: req.user.id,
      'entries._id': id
    });

    if (!diary) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy entry'
      });
    }

    const entry = diary.entries.id(id);
    if (!entry) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy entry'
      });
    }

    // Lấy thông tin thực phẩm để tính lại dinh dưỡng
    const food = await Food.findById(entry.food);
    if (!food) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy thông tin thực phẩm'
      });
    }

    // Cập nhật thông tin
    if (quantity) {
      const nutrition = calculateNutrition(food, quantity);
      entry.quantity = quantity;
      entry.calories = nutrition.calories;
      entry.protein = nutrition.protein;
      entry.carbs = nutrition.carbs;
      entry.fat = nutrition.fat;
    }

    if (mealType) {
      entry.mealType = mealType;
    }

    await diary.save();

    res.json({
      success: true,
      message: 'Cập nhật entry thành công',
      data: diary
    });
  } catch (error) {
    console.error('Update food entry error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi cập nhật entry'
    });
  }
};

// Xóa entry khỏi nhật ký
const deleteFoodEntry = async (req, res) => {
  try {
    const { id } = req.params; // entryId từ route

    // Tìm diary chứa entry với entryId và userId
    const diary = await FoodDiary.findOne({
      user: req.user.id,
      'entries._id': id
    });

    if (!diary) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy entry'
      });
    }

    diary.entries.pull(id);
    await diary.save();

    res.json({
      success: true,
      message: 'Xóa entry thành công',
      data: diary
    });
  } catch (error) {
    console.error('Delete food entry error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi xóa entry'
    });
  }
};

// Lấy thống kê dinh dưỡng
const getNutritionStats = async (req, res) => {
  try {
    const { period = '7' } = req.query; // 7 days by default
    const daysBack = parseInt(period);
    
    const endDate = new Date();
    endDate.setHours(23, 59, 59, 999);
    
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - daysBack + 1);
    startDate.setHours(0, 0, 0, 0);

    const diaries = await FoodDiary.find({
      user: req.user.id,
      date: { $gte: startDate, $lte: endDate }
    }).sort({ date: 1 });

    // Tính toán thống kê
    const dailyData = diaries.map(diary => ({
      date: diary.date,
      calories: diary.totalCalories,
      protein: diary.totalProtein,
      carbs: diary.totalCarbs,
      fat: diary.totalFat,
      mealBreakdown: {
        breakfast: diary.entries.filter(e => e.mealType === 'breakfast').reduce((sum, e) => sum + e.calories, 0),
        lunch: diary.entries.filter(e => e.mealType === 'lunch').reduce((sum, e) => sum + e.calories, 0),
        dinner: diary.entries.filter(e => e.mealType === 'dinner').reduce((sum, e) => sum + e.calories, 0),
        snack: diary.entries.filter(e => e.mealType === 'snack').reduce((sum, e) => sum + e.calories, 0)
      }
    }));

    // Tính trung bình
    const totalDays = diaries.length || 1;
    const averages = {
      calories: Math.round(diaries.reduce((sum, d) => sum + d.totalCalories, 0) / totalDays),
      protein: Math.round(diaries.reduce((sum, d) => sum + d.totalProtein, 0) / totalDays * 10) / 10,
      carbs: Math.round(diaries.reduce((sum, d) => sum + d.totalCarbs, 0) / totalDays * 10) / 10,
      fat: Math.round(diaries.reduce((sum, d) => sum + d.totalFat, 0) / totalDays * 10) / 10
    };

    res.json({
      success: true,
      data: {
        period: daysBack,
        totalDays,
        dailyData,
        averages,
        latest: diaries[diaries.length - 1] || null
      }
    });
  } catch (error) {
    console.error('Get nutrition stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi lấy thống kê dinh dưỡng'
    });
  }
};

// Lấy thực phẩm phổ biến của user
const getPopularFoods = async (req, res) => {
  try {
    const { limit = 10 } = req.query;

    const pipeline = [
      { $match: { user: req.user.id } },
      { $unwind: '$entries' },
      {
        $group: {
          _id: '$entries.food',
          foodName: { $first: '$entries.foodName' },
          count: { $sum: 1 },
          totalCalories: { $sum: '$entries.calories' }
        }
      },
      { $sort: { count: -1 } },
      { $limit: parseInt(limit) },
      {
        $lookup: {
          from: 'foods',
          localField: '_id',
          foreignField: '_id',
          as: 'foodInfo'
        }
      },
      {
        $project: {
          foodName: 1,
          count: 1,
          totalCalories: 1,
          category: { $arrayElemAt: ['$foodInfo.category', 0] },
          caloriesPer100g: { $arrayElemAt: ['$foodInfo.caloriesPer100g', 0] }
        }
      }
    ];

    const popularFoods = await FoodDiary.aggregate(pipeline);

    res.json({
      success: true,
      data: popularFoods
    });
  } catch (error) {
    console.error('Get popular foods error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi lấy thực phẩm phổ biến'
    });
  }
};

module.exports = {
  addFoodEntry,
  getDiaryByDate,
  getDiaryByRange,
  updateFoodEntry,
  deleteFoodEntry,
  getNutritionStats,
  getPopularFoods
}; 