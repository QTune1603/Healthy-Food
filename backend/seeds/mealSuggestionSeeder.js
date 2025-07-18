const mongoose = require('mongoose');
const MealSuggestion = require('../models/MealSuggestion');

const mealSuggestionsData = [
  // Breakfast
  {
    title: 'Phở Bò Truyền Thống',
    description: 'Phở bò nóng hổi với thịt bò tái và nước dùng trong',
    calories: 350,
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c',
    protein: 25,
    carbs: 45,
    fat: 8,
    fiber: 3,
    mealType: 'breakfast',
    difficulty: 'medium',
    prepTime: 30,
    servings: 1,
    tags: ['traditional', 'high-protein'],
    suitableForGoals: ['maintain', 'gain'],
    ingredients: [
      { name: 'Bánh phở', amount: '100', unit: 'g' },
      { name: 'Thịt bò', amount: '80', unit: 'g' },
      { name: 'Nước dùng', amount: '400', unit: 'ml' }
    ],
    featured: true
  },
  {
    title: 'Bánh Mì Thịt Nướng',
    description: 'Bánh mì giòn với thịt nướng thơm ngon',
    calories: 420,
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b',
    protein: 22,
    carbs: 55,
    fat: 12,
    fiber: 4,
    mealType: 'breakfast',
    difficulty: 'easy',
    prepTime: 15,
    servings: 1,
    tags: ['quick', 'high-protein'],
    suitableForGoals: ['maintain', 'gain'],
    featured: true
  },
  {
    title: 'Cháo Gà Dinh Dưỡng',
    description: 'Cháo gà mềm mịn bổ dưỡng cho bữa sáng',
    calories: 280,
    image: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445',
    protein: 18,
    carbs: 35,
    fat: 6,
    fiber: 2,
    mealType: 'breakfast',
    difficulty: 'medium',
    prepTime: 45,
    servings: 1,
    tags: ['comfort-food', 'high-protein'],
    suitableForGoals: ['lose', 'maintain']
  },

  // Lunch
  {
    title: 'Cơm Gà Hấp Hành',
    description: 'Cơm trắng với gà hấp hành tây thơm ngon',
    calories: 520,
    image: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe',
    protein: 35,
    carbs: 65,
    fat: 10,
    fiber: 3,
    mealType: 'lunch',
    difficulty: 'medium',
    prepTime: 40,
    servings: 1,
    tags: ['traditional', 'high-protein'],
    suitableForGoals: ['maintain', 'gain'],
    featured: true
  },
  {
    title: 'Bún Chả Hà Nội',
    description: 'Bún chả truyền thống với thịt nướng và nước mắm pha',
    calories: 450,
    image: 'https://images.unsplash.com/photo-1551782450-a2132b4ba21d',
    protein: 28,
    carbs: 52,
    fat: 14,
    fiber: 4,
    mealType: 'lunch',
    difficulty: 'hard',
    prepTime: 60,
    servings: 1,
    tags: ['traditional', 'grilled'],
    suitableForGoals: ['maintain', 'gain'],
    featured: true
  },
  {
    title: 'Cơm Tấm Sườn Nướng',
    description: 'Cơm tấm với sườn nướng và trứng ốp la',
    calories: 580,
    image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1',
    protein: 32,
    carbs: 68,
    fat: 16,
    fiber: 3,
    mealType: 'lunch',
    difficulty: 'medium',
    prepTime: 35,
    servings: 1,
    tags: ['traditional', 'high-protein'],
    suitableForGoals: ['gain']
  },

  // Dinner
  {
    title: 'Canh Chua Cá Lóc',
    description: 'Canh chua cá lóc với rau muống và cà chua',
    calories: 320,
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c',
    protein: 25,
    carbs: 15,
    fat: 18,
    fiber: 5,
    mealType: 'dinner',
    difficulty: 'medium',
    prepTime: 30,
    servings: 1,
    tags: ['traditional', 'low-carb'],
    suitableForGoals: ['lose', 'maintain']
  },
  {
    title: 'Gỏi Cuốn Tôm Thịt',
    description: 'Gỏi cuốn tươi mát với tôm và thịt luộc',
    calories: 180,
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b',
    protein: 15,
    carbs: 20,
    fat: 4,
    fiber: 3,
    mealType: 'dinner',
    difficulty: 'easy',
    prepTime: 20,
    servings: 2,
    tags: ['light', 'fresh', 'low-carb'],
    suitableForGoals: ['lose', 'maintain']
  },
  {
    title: 'Cà Ri Gà Rau Củ',
    description: 'Cà ri gà với khoai tây và cà rốt',
    calories: 420,
    image: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445',
    protein: 28,
    carbs: 35,
    fat: 20,
    fiber: 6,
    mealType: 'dinner',
    difficulty: 'medium',
    prepTime: 45,
    servings: 1,
    tags: ['traditional', 'spicy'],
    suitableForGoals: ['maintain', 'gain']
  },

  // Snacks
  {
    title: 'Chè Đậu Xanh',
    description: 'Chè đậu xanh mát lạnh bổ dưỡng',
    calories: 150,
    image: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe',
    protein: 6,
    carbs: 28,
    fat: 2,
    fiber: 4,
    mealType: 'snack',
    difficulty: 'easy',
    prepTime: 25,
    servings: 1,
    tags: ['vegetarian', 'sweet'],
    suitableForGoals: ['lose', 'maintain']
  },
  {
    title: 'Bánh Flan Caramen',
    description: 'Bánh flan mềm mịn với caramen đắng nhẹ',
    calories: 220,
    image: 'https://images.unsplash.com/photo-1551782450-a2132b4ba21d',
    protein: 8,
    carbs: 35,
    fat: 6,
    fiber: 0,
    mealType: 'snack',
    difficulty: 'hard',
    prepTime: 90,
    servings: 1,
    tags: ['sweet', 'dessert'],
    suitableForGoals: ['maintain', 'gain']
  },
  {
    title: 'Sinh Tố Bơ',
    description: 'Sinh tố bơ sánh mịn giàu vitamin',
    calories: 280,
    image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1',
    protein: 4,
    carbs: 25,
    fat: 18,
    fiber: 8,
    mealType: 'snack',
    difficulty: 'easy',
    prepTime: 5,
    servings: 1,
    tags: ['healthy', 'high-fiber'],
    suitableForGoals: ['maintain', 'gain']
  },

  // More breakfast options
  {
    title: 'Xôi Gà Nấm Hương',
    description: 'Xôi nếp với gà xé và nấm hương thơm',
    calories: 380,
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c',
    protein: 20,
    carbs: 58,
    fat: 8,
    fiber: 3,
    mealType: 'breakfast',
    difficulty: 'medium',
    prepTime: 50,
    servings: 1,
    tags: ['traditional', 'filling'],
    suitableForGoals: ['maintain', 'gain']
  },
  {
    title: 'Bánh Cuốn Thịt',
    description: 'Bánh cuốn mỏng với nhân thịt băm',
    calories: 320,
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b',
    protein: 18,
    carbs: 42,
    fat: 9,
    fiber: 2,
    mealType: 'breakfast',
    difficulty: 'hard',
    prepTime: 60,
    servings: 1,
    tags: ['traditional', 'delicate'],
    suitableForGoals: ['maintain']
  },

  // More lunch options
  {
    title: 'Bún Riêu Cua',
    description: 'Bún riêu cua đồng với cà chua và rau sống',
    calories: 390,
    image: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445',
    protein: 22,
    carbs: 48,
    fat: 12,
    fiber: 4,
    mealType: 'lunch',
    difficulty: 'hard',
    prepTime: 90,
    servings: 1,
    tags: ['traditional', 'seafood'],
    suitableForGoals: ['maintain', 'gain']
  },
  {
    title: 'Cơm Chiên Dương Châu',
    description: 'Cơm chiên với tôm, xúc xích và rau củ',
    calories: 480,
    image: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe',
    protein: 24,
    carbs: 62,
    fat: 15,
    fiber: 3,
    mealType: 'lunch',
    difficulty: 'medium',
    prepTime: 25,
    servings: 1,
    tags: ['fried', 'mixed'],
    suitableForGoals: ['maintain', 'gain']
  },

  // More dinner options
  {
    title: 'Lẩu Thái Chay',
    description: 'Lẩu thái chay với rau củ và nấm',
    calories: 250,
    image: 'https://images.unsplash.com/photo-1551782450-a2132b4ba21d',
    protein: 12,
    carbs: 30,
    fat: 8,
    fiber: 8,
    mealType: 'dinner',
    difficulty: 'medium',
    prepTime: 35,
    servings: 2,
    tags: ['vegetarian', 'spicy', 'low-carb'],
    suitableForGoals: ['lose', 'maintain']
  },
  {
    title: 'Cá Kho Tộ',
    description: 'Cá kho tộ đậm đà với nước dừa',
    calories: 360,
    image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1',
    protein: 30,
    carbs: 8,
    fat: 22,
    fiber: 2,
    mealType: 'dinner',
    difficulty: 'medium',
    prepTime: 40,
    servings: 1,
    tags: ['traditional', 'high-protein'],
    suitableForGoals: ['maintain', 'gain']
  },

  // More snacks
  {
    title: 'Bánh Tráng Nướng',
    description: 'Bánh tráng nướng giòn với trứng và hành lá',
    calories: 160,
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c',
    protein: 8,
    carbs: 22,
    fat: 4,
    fiber: 2,
    mealType: 'snack',
    difficulty: 'easy',
    prepTime: 10,
    servings: 1,
    tags: ['street-food', 'crispy'],
    suitableForGoals: ['lose', 'maintain']
  },
  {
    title: 'Nước Mía Tươi',
    description: 'Nước mía tươi mát thanh nhiệt',
    calories: 120,
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b',
    protein: 0,
    carbs: 30,
    fat: 0,
    fiber: 0,
    mealType: 'snack',
    difficulty: 'easy',
    prepTime: 5,
    servings: 1,
    tags: ['drink', 'refreshing'],
    suitableForGoals: ['maintain']
  }
];

const seedMealSuggestions = async () => {
  try {
    console.log('🌱 Đang xóa dữ liệu meal suggestions cũ...');
    await MealSuggestion.deleteMany({});
    
    console.log('🌱 Đang thêm meal suggestions mới...');
    await MealSuggestion.insertMany(mealSuggestionsData);
    
    console.log(`✅ Đã thêm ${mealSuggestionsData.length} meal suggestions thành công!`);
  } catch (error) {
    console.error('❌ Lỗi khi seed meal suggestions:', error);
    throw error;
  }
};

// Chạy seeder nếu file được gọi trực tiếp
if (require.main === module) {
  const connectDB = require('../config/database');
  
  const runSeeder = async () => {
    try {
      await connectDB();
      await seedMealSuggestions();
      console.log('🎉 Seed meal suggestions hoàn tất!');
      process.exit(0);
    } catch (error) {
      console.error('❌ Lỗi khi chạy seeder:', error);
      process.exit(1);
    }
  };
  
  runSeeder();
}

module.exports = seedMealSuggestions; 