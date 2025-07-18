const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Food = require('../models/Food');
const connectDB = require('../config/database');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const foodsData = [
  // Protein
  {
    name: 'Thịt gà (ức)',
    category: 'protein',
    caloriesPer100g: 165,
    protein: 31,
    carbs: 0,
    fat: 3.6,
    fiber: 0,
    sugar: 0,
    sodium: 74,
    unit: 'g'
  },
  {
    name: 'Thịt bò (nạc)',
    category: 'protein',
    caloriesPer100g: 250,
    protein: 26,
    carbs: 0,
    fat: 17,
    fiber: 0,
    sugar: 0,
    sodium: 72,
    unit: 'g'
  },
  {
    name: 'Cá hồi',
    category: 'protein',
    caloriesPer100g: 208,
    protein: 25,
    carbs: 0,
    fat: 12,
    fiber: 0,
    sugar: 0,
    sodium: 59,
    unit: 'g'
  },
  {
    name: 'Trứng gà',
    category: 'protein',
    caloriesPer100g: 155,
    protein: 13,
    carbs: 1.1,
    fat: 11,
    fiber: 0,
    sugar: 1.1,
    sodium: 124,
    unit: 'g'
  },
  {
    name: 'Đậu phụ',
    category: 'protein',
    caloriesPer100g: 76,
    protein: 8,
    carbs: 1.9,
    fat: 4.8,
    fiber: 0.3,
    sugar: 0.6,
    sodium: 7,
    unit: 'g'
  },

  // Vegetables
  {
    name: 'Bông cải xanh',
    category: 'vegetables',
    caloriesPer100g: 34,
    protein: 2.8,
    carbs: 7,
    fat: 0.4,
    fiber: 2.6,
    sugar: 1.5,
    sodium: 33,
    unit: 'g'
  },
  {
    name: 'Cà rót',
    category: 'vegetables',
    caloriesPer100g: 25,
    protein: 1,
    carbs: 6,
    fat: 0.2,
    fiber: 3,
    sugar: 3.5,
    sodium: 2,
    unit: 'g'
  },
  {
    name: 'Cải bó xôi',
    category: 'vegetables',
    caloriesPer100g: 23,
    protein: 2.9,
    carbs: 3.6,
    fat: 0.4,
    fiber: 2.2,
    sugar: 0.4,
    sodium: 79,
    unit: 'g'
  },
  {
    name: 'Cà chua',
    category: 'vegetables',
    caloriesPer100g: 18,
    protein: 0.9,
    carbs: 3.9,
    fat: 0.2,
    fiber: 1.2,
    sugar: 2.6,
    sodium: 5,
    unit: 'g'
  },
  {
    name: 'Dưa chuột',
    category: 'vegetables',
    caloriesPer100g: 16,
    protein: 0.7,
    carbs: 4,
    fat: 0.1,
    fiber: 0.5,
    sugar: 1.7,
    sodium: 2,
    unit: 'g'
  },

  // Fruits
  {
    name: 'Chuối',
    category: 'fruits',
    caloriesPer100g: 89,
    protein: 1.1,
    carbs: 23,
    fat: 0.3,
    fiber: 2.6,
    sugar: 12,
    sodium: 1,
    unit: 'g'
  },
  {
    name: 'Táo',
    category: 'fruits',
    caloriesPer100g: 52,
    protein: 0.3,
    carbs: 14,
    fat: 0.2,
    fiber: 2.4,
    sugar: 10,
    sodium: 1,
    unit: 'g'
  },
  {
    name: 'Cam',
    category: 'fruits',
    caloriesPer100g: 47,
    protein: 0.9,
    carbs: 12,
    fat: 0.1,
    fiber: 2.4,
    sugar: 9,
    sodium: 0,
    unit: 'g'
  },
  {
    name: 'Dưa hấu',
    category: 'fruits',
    caloriesPer100g: 30,
    protein: 0.6,
    carbs: 8,
    fat: 0.2,
    fiber: 0.4,
    sugar: 6,
    sodium: 1,
    unit: 'g'
  },
  {
    name: 'Nho',
    category: 'fruits',
    caloriesPer100g: 62,
    protein: 0.6,
    carbs: 16,
    fat: 0.2,
    fiber: 0.9,
    sugar: 16,
    sodium: 2,
    unit: 'g'
  },

  // Grains
  {
    name: 'Gạo trắng (nấu chín)',
    category: 'grains',
    caloriesPer100g: 130,
    protein: 2.7,
    carbs: 28,
    fat: 0.3,
    fiber: 0.4,
    sugar: 0.1,
    sodium: 1,
    unit: 'g'
  },
  {
    name: 'Yến mạch',
    category: 'grains',
    caloriesPer100g: 389,
    protein: 17,
    carbs: 66,
    fat: 7,
    fiber: 11,
    sugar: 0.9,
    sodium: 2,
    unit: 'g'
  },
  {
    name: 'Bánh mì nguyên cám',
    category: 'grains',
    caloriesPer100g: 247,
    protein: 13,
    carbs: 41,
    fat: 4.2,
    fiber: 7,
    sugar: 6,
    sodium: 491,
    unit: 'g'
  },
  {
    name: 'Khoai tây',
    category: 'grains',
    caloriesPer100g: 77,
    protein: 2,
    carbs: 17,
    fat: 0.1,
    fiber: 2.2,
    sugar: 0.8,
    sodium: 6,
    unit: 'g'
  },
  {
    name: 'Khoai lang',
    category: 'grains',
    caloriesPer100g: 86,
    protein: 1.6,
    carbs: 20,
    fat: 0.1,
    fiber: 3,
    sugar: 4.2,
    sodium: 54,
    unit: 'g'
  },

  // Dairy
  {
    name: 'Sữa tươi nguyên chất',
    category: 'dairy',
    caloriesPer100g: 42,
    protein: 3.4,
    carbs: 5,
    fat: 1,
    fiber: 0,
    sugar: 5,
    sodium: 44,
    unit: 'ml'
  },
  {
    name: 'Sữa chua Hy Lạp',
    category: 'dairy',
    caloriesPer100g: 59,
    protein: 10,
    carbs: 3.6,
    fat: 0.4,
    fiber: 0,
    sugar: 3.6,
    sodium: 36,
    unit: 'g'
  },
  {
    name: 'Phô mai Cheddar',
    category: 'dairy',
    caloriesPer100g: 403,
    protein: 25,
    carbs: 1.3,
    fat: 33,
    fiber: 0,
    sugar: 0.5,
    sodium: 621,
    unit: 'g'
  },

  // Nuts
  {
    name: 'Hạnh nhân',
    category: 'nuts',
    caloriesPer100g: 579,
    protein: 21,
    carbs: 22,
    fat: 50,
    fiber: 12,
    sugar: 4,
    sodium: 1,
    unit: 'g'
  },
  {
    name: 'Óc chó',
    category: 'nuts',
    caloriesPer100g: 654,
    protein: 15,
    carbs: 14,
    fat: 65,
    fiber: 7,
    sugar: 2.6,
    sodium: 2,
    unit: 'g'
  },
  {
    name: 'Đậu phộng',
    category: 'nuts',
    caloriesPer100g: 567,
    protein: 26,
    carbs: 16,
    fat: 49,
    fiber: 8,
    sugar: 4,
    sodium: 18,
    unit: 'g'
  },

  // Beverages
  {
    name: 'Nước lọc',
    category: 'beverages',
    caloriesPer100g: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
    fiber: 0,
    sugar: 0,
    sodium: 0,
    unit: 'ml'
  },
  {
    name: 'Trà xanh',
    category: 'beverages',
    caloriesPer100g: 1,
    protein: 0,
    carbs: 0,
    fat: 0,
    fiber: 0,
    sugar: 0,
    sodium: 1,
    unit: 'ml'
  },
  {
    name: 'Cà phê đen',
    category: 'beverages',
    caloriesPer100g: 2,
    protein: 0.3,
    carbs: 0,
    fat: 0,
    fiber: 0,
    sugar: 0,
    sodium: 5,
    unit: 'ml'
  },

  // Others
  {
    name: 'Dầu ô liu',
    category: 'others',
    caloriesPer100g: 884,
    protein: 0,
    carbs: 0,
    fat: 100,
    fiber: 0,
    sugar: 0,
    sodium: 2,
    unit: 'ml'
  },
  {
    name: 'Mật ong',
    category: 'others',
    caloriesPer100g: 304,
    protein: 0.3,
    carbs: 82,
    fat: 0,
    fiber: 0.2,
    sugar: 82,
    sodium: 4,
    unit: 'g'
  }
];

const seedFoods = async () => {
  try {
    // Xóa dữ liệu cũ
    await Food.deleteMany({});
    console.log('Đã xóa dữ liệu thực phẩm cũ');

    // Thêm dữ liệu mới
    await Food.insertMany(foodsData);
    console.log(`Đã thêm ${foodsData.length} thực phẩm vào database`);

    console.log('Seeding foods completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding foods:', error);
    process.exit(1);
  }
};

seedFoods(); 