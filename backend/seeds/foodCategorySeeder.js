const mongoose = require('mongoose');
const connectDB = require('../config/database');
const Food = require('../models/Food');

// Dữ liệu thực phẩm Việt Nam theo nhóm
const vietnameseFoods = [
  // 1. Gạo và các sản phẩm từ gạo
  {
    category: 'Gạo và sản phẩm từ gạo',
    foods: [
      { name: 'Cơm trắng', caloriesPer100g: 130, protein: 2.7, carbs: 28, fat: 0.3, unit: 'g' },
      { name: 'Cơm tấm', caloriesPer100g: 135, protein: 2.8, carbs: 29, fat: 0.4, unit: 'g' },
      { name: 'Bánh tráng', caloriesPer100g: 334, protein: 8.5, carbs: 73, fat: 1.2, unit: 'g' },
      { name: 'Bánh phở', caloriesPer100g: 109, protein: 1.8, carbs: 25, fat: 0.2, unit: 'g' },
      { name: 'Bún tươi', caloriesPer100g: 108, protein: 2.0, carbs: 25, fat: 0.1, unit: 'g' },
      { name: 'Bánh canh', caloriesPer100g: 112, protein: 1.9, carbs: 26, fat: 0.2, unit: 'g' },
      { name: 'Xôi nếp', caloriesPer100g: 116, protein: 2.4, carbs: 26, fat: 0.3, unit: 'g' },
      { name: 'Bánh chưng', caloriesPer100g: 179, protein: 5.1, carbs: 32, fat: 3.8, unit: 'g' }
    ]
  },

  // 2. Thịt và sản phẩm từ thịt
  {
    category: 'Thịt và sản phẩm từ thịt',
    foods: [
      { name: 'Thịt heo nạc', caloriesPer100g: 143, protein: 20.9, carbs: 0, fat: 6.8, unit: 'g' },
      { name: 'Thịt heo ba chỉ', caloriesPer100g: 518, protein: 9.3, carbs: 0, fat: 53, unit: 'g' },
      { name: 'Thịt bò nạc', caloriesPer100g: 158, protein: 26, carbs: 0, fat: 5.7, unit: 'g' },
      { name: 'Thịt gà ta', caloriesPer100g: 135, protein: 25, carbs: 0, fat: 3.6, unit: 'g' },
      { name: 'Thịt vịt', caloriesPer100g: 201, protein: 18.3, carbs: 0, fat: 14.2, unit: 'g' },
      { name: 'Chả lụa', caloriesPer100g: 160, protein: 14.5, carbs: 8.2, fat: 7.8, unit: 'g' },
      { name: 'Nem nướng', caloriesPer100g: 190, protein: 16.2, carbs: 5.1, fat: 11.5, unit: 'g' },
      { name: 'Xúc xích', caloriesPer100g: 277, protein: 12.1, carbs: 3.5, fat: 24.1, unit: 'g' }
    ]
  },

  // 3. Cá và hải sản
  {
    category: 'Cá và hải sản',
    foods: [
      { name: 'Cá rô phi', caloriesPer100g: 96, protein: 20.1, carbs: 0, fat: 1.7, unit: 'g' },
      { name: 'Cá tra', caloriesPer100g: 156, protein: 15.6, carbs: 0, fat: 10.4, unit: 'g' },
      { name: 'Cá thu', caloriesPer100g: 139, protein: 21.4, carbs: 0, fat: 5.6, unit: 'g' },
      { name: 'Cá hồi', caloriesPer100g: 208, protein: 20.4, carbs: 0, fat: 13.4, unit: 'g' },
      { name: 'Tôm sú', caloriesPer100g: 106, protein: 20.3, carbs: 0.9, fat: 1.7, unit: 'g' },
      { name: 'Cua biển', caloriesPer100g: 83, protein: 18.1, carbs: 0, fat: 1.1, unit: 'g' },
      { name: 'Mực ống', caloriesPer100g: 92, protein: 15.6, carbs: 3.1, fat: 1.4, unit: 'g' },
      { name: 'Nghêu', caloriesPer100g: 86, protein: 14.2, carbs: 4.7, fat: 1.0, unit: 'g' }
    ]
  },

  // 4. Trứng và sản phẩm từ trứng
  {
    category: 'Trứng và sản phẩm từ trứng',
    foods: [
      { name: 'Trứng gà', caloriesPer100g: 155, protein: 13.0, carbs: 1.1, fat: 10.6, unit: 'g' },
      { name: 'Trứng vịt', caloriesPer100g: 185, protein: 12.8, carbs: 1.5, fat: 13.8, unit: 'g' },
      { name: 'Trứng cút', caloriesPer100g: 158, protein: 13.1, carbs: 0.4, fat: 11.1, unit: 'g' },
      { name: 'Trứng muối', caloriesPer100g: 195, protein: 13.6, carbs: 0.8, fat: 15.2, unit: 'g' },
      { name: 'Trứng chiên', caloriesPer100g: 196, protein: 13.6, carbs: 0.8, fat: 15.3, unit: 'g' }
    ]
  },

  // 5. Rau củ quả
  {
    category: 'Rau củ quả',
    foods: [
      { name: 'Rau muống', caloriesPer100g: 19, protein: 2.6, carbs: 3.1, fat: 0.2, unit: 'g' },
      { name: 'Cải thảo', caloriesPer100g: 13, protein: 1.5, carbs: 2.2, fat: 0.2, unit: 'g' },
      { name: 'Cà chua', caloriesPer100g: 18, protein: 0.9, carbs: 3.9, fat: 0.2, unit: 'g' },
      { name: 'Dưa chuột', caloriesPer100g: 15, protein: 0.7, carbs: 3.6, fat: 0.1, unit: 'g' },
      { name: 'Cà rót', caloriesPer100g: 25, protein: 1.0, carbs: 5.9, fat: 0.2, unit: 'g' },
      { name: 'Đậu bắp', caloriesPer100g: 22, protein: 1.8, carbs: 4.3, fat: 0.2, unit: 'g' },
      { name: 'Khoai tây', caloriesPer100g: 77, protein: 2.0, carbs: 17.5, fat: 0.1, unit: 'g' },
      { name: 'Khoai lang', caloriesPer100g: 86, protein: 1.6, carbs: 20.1, fat: 0.1, unit: 'g' },
      { name: 'Măng tây', caloriesPer100g: 20, protein: 2.2, carbs: 3.9, fat: 0.1, unit: 'g' },
      { name: 'Bí đỏ', caloriesPer100g: 26, protein: 1.0, carbs: 6.5, fat: 0.1, unit: 'g' }
    ]
  },

  // 6. Trái cây
  {
    category: 'Trái cây',
    foods: [
      { name: 'Chuối', caloriesPer100g: 89, protein: 1.1, carbs: 22.8, fat: 0.3, unit: 'g' },
      { name: 'Táo', caloriesPer100g: 52, protein: 0.3, carbs: 13.8, fat: 0.2, unit: 'g' },
      { name: 'Cam', caloriesPer100g: 47, protein: 0.9, carbs: 11.8, fat: 0.1, unit: 'g' },
      { name: 'Xoài', caloriesPer100g: 60, protein: 0.8, carbs: 15.0, fat: 0.4, unit: 'g' },
      { name: 'Đu đủ', caloriesPer100g: 43, protein: 0.5, carbs: 10.8, fat: 0.3, unit: 'g' },
      { name: 'Dứa', caloriesPer100g: 50, protein: 0.5, carbs: 13.1, fat: 0.1, unit: 'g' },
      { name: 'Nho', caloriesPer100g: 62, protein: 0.6, carbs: 16.3, fat: 0.2, unit: 'g' },
      { name: 'Dưa hấu', caloriesPer100g: 30, protein: 0.6, carbs: 7.6, fat: 0.2, unit: 'g' },
      { name: 'Vải', caloriesPer100g: 66, protein: 0.8, carbs: 16.5, fat: 0.4, unit: 'g' },
      { name: 'Mít', caloriesPer100g: 95, protein: 1.7, carbs: 23.3, fat: 0.6, unit: 'g' }
    ]
  },

  // 7. Đậu và các sản phẩm từ đậu
  {
    category: 'Đậu và sản phẩm từ đậu',
    foods: [
      { name: 'Đậu hũ', caloriesPer100g: 76, protein: 8.1, carbs: 1.9, fat: 4.8, unit: 'g' },
      { name: 'Tương đậu nành', caloriesPer100g: 192, protein: 14.4, carbs: 14.2, fat: 9.0, unit: 'g' },
      { name: 'Đậu xanh', caloriesPer100g: 347, protein: 23.9, carbs: 58.9, fat: 1.2, unit: 'g' },
      { name: 'Đậu đen', caloriesPer100g: 341, protein: 21.6, carbs: 63.4, fat: 1.4, unit: 'g' },
      { name: 'Đậu phộng', caloriesPer100g: 567, protein: 25.8, carbs: 16.1, fat: 49.2, unit: 'g' },
      { name: 'Chế biến đậu', caloriesPer100g: 150, protein: 12.0, carbs: 8.5, fat: 7.2, unit: 'g' }
    ]
  },

  // 8. Sữa và sản phẩm từ sữa
  {
    category: 'Sữa và sản phẩm từ sữa',
    foods: [
      { name: 'Sữa bò tươi', caloriesPer100g: 42, protein: 3.4, carbs: 5.0, fat: 1.0, unit: 'ml' },
      { name: 'Sữa chua', caloriesPer100g: 59, protein: 3.5, carbs: 4.7, fat: 3.3, unit: 'g' },
      { name: 'Phô mai', caloriesPer100g: 113, protein: 7.1, carbs: 0.4, fat: 9.3, unit: 'g' },
      { name: 'Kem tươi', caloriesPer100g: 345, protein: 2.8, carbs: 2.9, fat: 36.1, unit: 'ml' }
    ]
  },

  // 9. Dầu mỡ thực vật
  {
    category: 'Dầu mỡ thực vật',
    foods: [
      { name: 'Dầu ăn', caloriesPer100g: 884, protein: 0, carbs: 0, fat: 100, unit: 'ml' },
      { name: 'Dầu dừa', caloriesPer100g: 862, protein: 0, carbs: 0, fat: 99.1, unit: 'ml' },
      { name: 'Dầu olive', caloriesPer100g: 884, protein: 0, carbs: 0, fat: 100, unit: 'ml' },
      { name: 'Bơ thực vật', caloriesPer100g: 717, protein: 0.9, carbs: 0.7, fat: 81.0, unit: 'g' }
    ]
  },

  // 10. Đồ uống
  {
    category: 'Đồ uống',
    foods: [
      { name: 'Nước lọc', caloriesPer100g: 0, protein: 0, carbs: 0, fat: 0, unit: 'ml' },
      { name: 'Nước ngọt', caloriesPer100g: 42, protein: 0, carbs: 10.6, fat: 0, unit: 'ml' },
      { name: 'Bia', caloriesPer100g: 43, protein: 0.5, carbs: 3.6, fat: 0, unit: 'ml' },
      { name: 'Cà phê đen', caloriesPer100g: 2, protein: 0.3, carbs: 0.0, fat: 0.0, unit: 'ml' },
      { name: 'Trà xanh', caloriesPer100g: 1, protein: 0.2, carbs: 0.0, fat: 0.0, unit: 'ml' },
      { name: 'Nước dừa', caloriesPer100g: 19, protein: 0.7, carbs: 3.7, fat: 0.2, unit: 'ml' },
      { name: 'Nước chanh', caloriesPer100g: 22, protein: 0.4, carbs: 6.9, fat: 0.2, unit: 'ml' }
    ]
  },

  // 11. Bánh kẹo
  {
    category: 'Bánh kẹo',
    foods: [
      { name: 'Bánh mì', caloriesPer100g: 265, protein: 9.0, carbs: 49.0, fat: 3.2, unit: 'g' },
      { name: 'Bánh quy', caloriesPer100g: 502, protein: 5.9, carbs: 62.1, fat: 25.4, unit: 'g' },
      { name: 'Bánh flan', caloriesPer100g: 127, protein: 4.4, carbs: 19.2, fat: 4.0, unit: 'g' },
      { name: 'Kẹo', caloriesPer100g: 394, protein: 0.0, carbs: 98.0, fat: 0.2, unit: 'g' },
      { name: 'Chocolate', caloriesPer100g: 546, protein: 4.9, carbs: 61.0, fat: 31.3, unit: 'g' },
      { name: 'Bánh bông lan', caloriesPer100g: 347, protein: 6.8, carbs: 58.0, fat: 10.8, unit: 'g' }
    ]
  },

  // 12. Gia vị và condiments
  {
    category: 'Gia vị và condiments',
    foods: [
      { name: 'Muối', caloriesPer100g: 0, protein: 0, carbs: 0, fat: 0, unit: 'g' },
      { name: 'Đường', caloriesPer100g: 387, protein: 0, carbs: 99.8, fat: 0, unit: 'g' },
      { name: 'Nước mắm', caloriesPer100g: 10, protein: 1.4, carbs: 0.6, fat: 0, unit: 'ml' },
      { name: 'Tương ớt', caloriesPer100g: 93, protein: 1.6, carbs: 18.0, fat: 0.9, unit: 'g' },
      { name: 'Tỏi', caloriesPer100g: 149, protein: 6.4, carbs: 33.1, fat: 0.5, unit: 'g' },
      { name: 'Hành lá', caloriesPer100g: 32, protein: 1.8, carbs: 7.3, fat: 0.2, unit: 'g' }
    ]
  }
];

const seedFoodDatabase = async () => {
  try {
    await connectDB();
    
    console.log('🌱 Starting Vietnamese food database seeder...');
    
    // Clear existing foods
    console.log('🗑️ Clearing existing food data...');
    await Food.deleteMany({});
    
    let totalFoodsCreated = 0;
    
    for (const categoryData of vietnameseFoods) {
      console.log(`📂 Creating foods for category: ${categoryData.category}`);
      
      const categoryFoods = categoryData.foods.map(food => ({
        ...food,
        category: categoryData.category,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }));
      
      const createdFoods = await Food.insertMany(categoryFoods);
      totalFoodsCreated += createdFoods.length;

      console.log(`✅ Created ${createdFoods.length} foods for ${categoryData.category}`);
    }
    
    console.log('\n🎉 Vietnamese food database seeder completed successfully!');
    console.log('📊 Summary:');
    console.log(`📂 Categories: ${vietnameseFoods.length}`);
    console.log(`🍽️ Total foods: ${totalFoodsCreated}`);

    console.log('\n📋 Categories created:');
    vietnameseFoods.forEach((categoryData, index) => {
      console.log(`${index + 1}. ${categoryData.category} (${categoryData.foods.length} foods)`);
    });
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding food database:', error);
    process.exit(1);
  }
};

// Run the seeder if called directly
if (require.main === module) {
  seedFoodDatabase();
}

module.exports = seedFoodDatabase;