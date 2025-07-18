const MealSuggestion = require('../models/MealSuggestion');

// Lấy tất cả gợi ý món ăn với filter
const getAllMealSuggestions = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 12, 
      mealType, 
      goal, 
      tags, 
      maxCalories, 
      minCalories,
      search,
      featured 
    } = req.query;
    
    const skip = (page - 1) * limit;

    // Build query
    let query = { isActive: true };
    
    if (mealType && mealType !== 'all') {
      query.mealType = mealType;
    }
    
    if (goal && goal !== 'all') {
      query.suitableForGoals = goal;
    }
    
    if (tags) {
      const tagArray = tags.split(',');
      query.tags = { $in: tagArray };
    }
    
    if (maxCalories) {
      query.calories = { ...query.calories, $lte: parseInt(maxCalories) };
    }
    
    if (minCalories) {
      query.calories = { ...query.calories, $gte: parseInt(minCalories) };
    }
    
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { $text: { $search: search } }
      ];
    }
    
    if (featured === 'true') {
      query.featured = true;
    }

    const meals = await MealSuggestion.find(query)
      .sort({ featured: -1, createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .populate('author', 'fullName')
      .select('-ingredients -instructions');

    const total = await MealSuggestion.countDocuments(query);

    res.json({
      success: true,
      data: {
        meals,
        pagination: {
          current: parseInt(page),
          pages: Math.ceil(total / limit),
          total
        }
      }
    });
  } catch (error) {
    console.error('Get meal suggestions error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi lấy gợi ý món ăn'
    });
  }
};

// Lấy thông tin chi tiết một món ăn
const getMealSuggestionById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const meal = await MealSuggestion.findById(id)
      .populate('author', 'fullName');
    
    if (!meal || !meal.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy món ăn'
      });
    }

    // Increment views
    meal.views += 1;
    await meal.save();

    res.json({
      success: true,
      data: meal
    });
  } catch (error) {
    console.error('Get meal suggestion by id error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi lấy thông tin món ăn'
    });
  }
};

// Lấy gợi ý món ăn dựa trên mục tiêu calo
const getMealSuggestionsByCalories = async (req, res) => {
  try {
    const { targetCalories, mealType = 'all', limit = 6 } = req.query;
    
    if (!targetCalories) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng cung cấp mục tiêu calo'
      });
    }

    const target = parseInt(targetCalories);
    
    // Tính toán khoảng calo cho từng bữa ăn
    let calorieRange = {};
    
    if (mealType === 'breakfast') {
      calorieRange = { min: target * 0.2, max: target * 0.3 }; // 20-30% tổng calo
    } else if (mealType === 'lunch') {
      calorieRange = { min: target * 0.3, max: target * 0.4 }; // 30-40% tổng calo
    } else if (mealType === 'dinner') {
      calorieRange = { min: target * 0.25, max: target * 0.35 }; // 25-35% tổng calo
    } else if (mealType === 'snack') {
      calorieRange = { min: target * 0.05, max: target * 0.15 }; // 5-15% tổng calo
    } else {
      // All meal types
      calorieRange = { min: target * 0.05, max: target * 0.4 };
    }

    let query = {
      isActive: true,
      calories: { 
        $gte: Math.round(calorieRange.min), 
        $lte: Math.round(calorieRange.max) 
      }
    };

    if (mealType !== 'all') {
      query.mealType = mealType;
    }

    const meals = await MealSuggestion.find(query)
      .sort({ featured: -1, likes: -1 })
      .limit(parseInt(limit))
      .select('title description calories image mealType tags prepTime difficulty');

    res.json({
      success: true,
      data: {
        meals,
        calorieRange: {
          min: Math.round(calorieRange.min),
          max: Math.round(calorieRange.max)
        },
        targetCalories: target
      }
    });
  } catch (error) {
    console.error('Get meal suggestions by calories error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi lấy gợi ý món ăn theo calo'
    });
  }
};

// Tìm kiếm món ăn
const searchMealSuggestions = async (req, res) => {
  try {
    const { q, limit = 10 } = req.query;
    
    if (!q) {
      return res.json({
        success: true,
        data: []
      });
    }

    const meals = await MealSuggestion.find({
      $and: [
        { isActive: true },
        {
          $or: [
            { title: { $regex: q, $options: 'i' } },
            { description: { $regex: q, $options: 'i' } },
            { $text: { $search: q } }
          ]
        }
      ]
    })
    .select('title description calories image mealType tags')
    .limit(parseInt(limit))
    .sort({ likes: -1, views: -1 });

    res.json({
      success: true,
      data: meals
    });
  } catch (error) {
    console.error('Search meal suggestions error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi tìm kiếm món ăn'
    });
  }
};

// Tạo gợi ý món ăn mới (admin/user)
const createMealSuggestion = async (req, res) => {
  try {
    const {
      title,
      description,
      calories,
      image,
      protein = 0,
      carbs = 0,
      fat = 0,
      fiber = 0,
      mealType,
      difficulty = 'medium',
      prepTime,
      servings = 1,
      tags = [],
      suitableForGoals = ['maintain'],
      ingredients = [],
      instructions = []
    } = req.body;

    // Validation
    if (!title || !description || !calories || !image || !mealType) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng điền đầy đủ thông tin bắt buộc'
      });
    }

    const meal = new MealSuggestion({
      title,
      description,
      calories,
      image,
      protein,
      carbs,
      fat,
      fiber,
      mealType,
      difficulty,
      prepTime,
      servings,
      tags,
      suitableForGoals,
      ingredients,
      instructions,
      author: req.user.id
    });

    await meal.save();

    res.status(201).json({
      success: true,
      message: 'Tạo gợi ý món ăn thành công',
      data: meal
    });
  } catch (error) {
    console.error('Create meal suggestion error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi tạo gợi ý món ăn'
    });
  }
};

// Cập nhật gợi ý món ăn
const updateMealSuggestion = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const meal = await MealSuggestion.findOneAndUpdate(
      { _id: id, author: req.user.id },
      updateData,
      { new: true, runValidators: true }
    );

    if (!meal) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy món ăn hoặc bạn không có quyền chỉnh sửa'
      });
    }

    res.json({
      success: true,
      message: 'Cập nhật gợi ý món ăn thành công',
      data: meal
    });
  } catch (error) {
    console.error('Update meal suggestion error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi cập nhật gợi ý món ăn'
    });
  }
};

// Xóa gợi ý món ăn
const deleteMealSuggestion = async (req, res) => {
  try {
    const { id } = req.params;

    const meal = await MealSuggestion.findOneAndUpdate(
      { _id: id, author: req.user.id },
      { isActive: false },
      { new: true }
    );

    if (!meal) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy món ăn hoặc bạn không có quyền xóa'
      });
    }

    res.json({
      success: true,
      message: 'Xóa gợi ý món ăn thành công'
    });
  } catch (error) {
    console.error('Delete meal suggestion error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi xóa gợi ý món ăn'
    });
  }
};

// Like/Unlike món ăn
const toggleLikeMealSuggestion = async (req, res) => {
  try {
    const { id } = req.params;
    const { action } = req.body; // 'like' or 'unlike'

    const meal = await MealSuggestion.findById(id);
    if (!meal || !meal.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy món ăn'
      });
    }

    if (action === 'like') {
      meal.likes += 1;
    } else if (action === 'unlike' && meal.likes > 0) {
      meal.likes -= 1;
    }

    await meal.save();

    res.json({
      success: true,
      message: action === 'like' ? 'Đã thích món ăn' : 'Đã bỏ thích món ăn',
      data: { likes: meal.likes }
    });
  } catch (error) {
    console.error('Toggle like meal suggestion error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi thích/bỏ thích món ăn'
    });
  }
};

// Lấy món ăn phổ biến
const getPopularMealSuggestions = async (req, res) => {
  try {
    const { limit = 6 } = req.query;

    const meals = await MealSuggestion.find({ isActive: true })
      .sort({ likes: -1, views: -1 })
      .limit(parseInt(limit))
      .select('title description calories image mealType tags likes views');

    res.json({
      success: true,
      data: meals
    });
  } catch (error) {
    console.error('Get popular meal suggestions error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi lấy món ăn phổ biến'
    });
  }
};

module.exports = {
  getAllMealSuggestions,
  getMealSuggestionById,
  getMealSuggestionsByCalories,
  searchMealSuggestions,
  createMealSuggestion,
  updateMealSuggestion,
  deleteMealSuggestion,
  toggleLikeMealSuggestion,
  getPopularMealSuggestions
}; 