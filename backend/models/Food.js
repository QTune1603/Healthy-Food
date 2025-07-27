const mongoose = require('mongoose');

const foodSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    required: true,
    enum: [
      'protein', 'vegetables', 'fruits', 'grains', 'dairy', 'nuts', 'beverages', 'others',
      'Gạo và sản phẩm từ gạo',
      'Thịt và sản phẩm từ thịt', 
      'Cá và hải sản',
      'Trứng và sản phẩm từ trứng',
      'Rau củ quả',
      'Trái cây',
      'Đậu và sản phẩm từ đậu',
      'Sữa và sản phẩm từ sữa',
      'Dầu mỡ thực vật',
      'Đồ uống',
      'Bánh kẹo',
      'Gia vị và condiments'
    ]
  },
  caloriesPer100g: {
    type: Number,
    required: true,
    min: 0
  },
  protein: {
    type: Number,
    default: 0,
    min: 0
  },
  carbs: {
    type: Number,
    default: 0,
    min: 0
  },
  fat: {
    type: Number,
    default: 0,
    min: 0
  },
  fiber: {
    type: Number,
    default: 0,
    min: 0
  },
  sugar: {
    type: Number,
    default: 0,
    min: 0
  },
  sodium: {
    type: Number,
    default: 0,
    min: 0
  },
  unit: {
    type: String,
    default: 'g',
    enum: ['g', 'ml', 'piece', 'cup', 'tbsp', 'tsp']
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Index để tìm kiếm nhanh
foodSchema.index({ name: 'text', category: 1 });

module.exports = mongoose.model('Food', foodSchema); 