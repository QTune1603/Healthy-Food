const Food = require('../models/Food');

// Lấy tất cả thực phẩm với tìm kiếm và phân trang
const getAllFoods = async (req, res) => {
  try {
    const { page = 1, limit = 20, search, category } = req.query;
    const skip = (page - 1) * limit;

    // Build query
    let query = { isActive: true };
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { $text: { $search: search } }
      ];
    }
    
    if (category && category !== 'all') {
      query.category = category;
    }

    const foods = await Food.find(query)
      .sort({ name: 1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Food.countDocuments(query);

    res.json({
      success: true,
      data: {
        foods,
        pagination: {
          current: parseInt(page),
          pages: Math.ceil(total / limit),
          total
        }
      }
    });
  } catch (error) {
    console.error('Get foods error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi lấy danh sách thực phẩm'
    });
  }
};

// Lấy thông tin một thực phẩm
const getFoodById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const food = await Food.findById(id);
    if (!food) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy thực phẩm'
      });
    }

    res.json({
      success: true,
      data: food
    });
  } catch (error) {
    console.error('Get food by id error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi lấy thông tin thực phẩm'
    });
  }
};

// Tìm kiếm thực phẩm
const searchFoods = async (req, res) => {
  try {
    const { q, limit = 10 } = req.query;
    
    if (!q) {
      return res.json({
        success: true,
        data: []
      });
    }

    const foods = await Food.find({
      $and: [
        { isActive: true },
        {
          $or: [
            { name: { $regex: q, $options: 'i' } },
            { $text: { $search: q } }
          ]
        }
      ]
    })
    .select('name category caloriesPer100g protein carbs fat unit')
    .limit(parseInt(limit))
    .sort({ name: 1 });

    res.json({
      success: true,
      data: foods
    });
  } catch (error) {
    console.error('Search foods error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi tìm kiếm thực phẩm'
    });
  }
};

// Tạo thực phẩm mới (admin only)
const createFood = async (req, res) => {
  try {
    const {
      name,
      category,
      caloriesPer100g,
      protein = 0,
      carbs = 0,
      fat = 0,
      fiber = 0,
      sugar = 0,
      sodium = 0,
      unit = 'g'
    } = req.body;

    // Validation
    if (!name || !category || !caloriesPer100g) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng điền đầy đủ thông tin bắt buộc'
      });
    }

    // Check if food already exists
    const existingFood = await Food.findOne({ 
      name: { $regex: new RegExp(`^${name}$`, 'i') } 
    });
    
    if (existingFood) {
      return res.status(400).json({
        success: false,
        message: 'Thực phẩm này đã tồn tại'
      });
    }

    const food = new Food({
      name,
      category,
      caloriesPer100g,
      protein,
      carbs,
      fat,
      fiber,
      sugar,
      sodium,
      unit
    });

    await food.save();

    res.status(201).json({
      success: true,
      message: 'Tạo thực phẩm thành công',
      data: food
    });
  } catch (error) {
    console.error('Create food error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi tạo thực phẩm'
    });
  }
};

// Cập nhật thực phẩm (admin only)
const updateFood = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const food = await Food.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!food) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy thực phẩm'
      });
    }

    res.json({
      success: true,
      message: 'Cập nhật thực phẩm thành công',
      data: food
    });
  } catch (error) {
    console.error('Update food error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi cập nhật thực phẩm'
    });
  }
};

// Xóa thực phẩm (admin only)
const deleteFood = async (req, res) => {
  try {
    const { id } = req.params;

    const food = await Food.findByIdAndUpdate(
      id,
      { isActive: false },
      { new: true }
    );

    if (!food) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy thực phẩm'
      });
    }

    res.json({
      success: true,
      message: 'Xóa thực phẩm thành công'
    });
  } catch (error) {
    console.error('Delete food error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi xóa thực phẩm'
    });
  }
};

// Lấy danh sách categories
const getCategories = async (req, res) => {
  try {
    // Lấy các categories duy nhất từ database
    const categories = await Food.distinct('category', { isActive: true });
    
    // Map với icon cho mỗi category
    const categoriesWithIcons = categories.map(category => {
      let icon = '🍽️'; // default icon
      
      if (category.includes('Gạo') || category.includes('gạo')) icon = '🍚';
      else if (category.includes('Thịt') || category.includes('thịt')) icon = '🥩';
      else if (category.includes('Cá') || category.includes('cá') || category.includes('hải sản')) icon = '🐟';
      else if (category.includes('Trứng') || category.includes('trứng')) icon = '🥚';
      else if (category.includes('Rau') || category.includes('rau') || category.includes('củ')) icon = '🥬';
      else if (category.includes('Trái cây') || category.includes('trái cây')) icon = '🍎';
      else if (category.includes('Đậu') || category.includes('đậu')) icon = '🥜';
      else if (category.includes('Sữa') || category.includes('sữa')) icon = '🥛';
      else if (category.includes('Dầu') || category.includes('dầu')) icon = '🫒';
      else if (category.includes('Đồ uống') || category.includes('đồ uống')) icon = '🥤';
      else if (category.includes('Bánh') || category.includes('bánh') || category.includes('kẹo')) icon = '🍰';
      else if (category.includes('Gia vị') || category.includes('gia vị')) icon = '🧂';
      
      return {
        value: category,
        label: category,
        icon: icon
      };
    });

    res.json({
      success: true,
      data: categoriesWithIcons
    });
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi lấy danh sách categories'
    });
  }
};

module.exports = {
  getAllFoods,
  getFoodById,
  searchFoods,
  createFood,
  updateFood,
  deleteFood,
  getCategories
}; 