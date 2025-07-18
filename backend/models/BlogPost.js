const mongoose = require('mongoose');

const blogPostSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Vui lòng nhập tiêu đề'],
    trim: true
  },
  content: {
    type: String,
    required: [true, 'Vui lòng nhập nội dung']
  },
  excerpt: {
    type: String,
    trim: true
  },
  image: {
    type: String,
    default: ''
  },
  category: {
    type: String,
    required: [true, 'Vui lòng chọn danh mục'],
    enum: [
      'potatoes', 'vegetables', 'mushrooms', 'fruits', 'grains', 'proteins',
      'dairy', 'nuts', 'herbs', 'beverages', 'snacks', 'desserts',
      'vegetarian', 'organic', 'superfood', 'vitamins', 'diet'
    ]
  },
  parentCategory: {
    type: String,
    required: [true, 'Vui lòng chọn danh mục cha'],
    enum: ['Thực Phẩm Cơ Bản', 'Món Ăn Đặc Biệt', 'Thông Tin Dinh Dưỡng']
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  tags: [{
    type: String,
    trim: true
  }],
  nutritionInfo: {
    calories: { type: Number, default: 0 },
    protein: { type: Number, default: 0 },
    carbs: { type: Number, default: 0 },
    fat: { type: Number, default: 0 },
    fiber: { type: Number, default: 0 },
    sugar: { type: Number, default: 0 },
    sodium: { type: Number, default: 0 }
  },
  servingSize: {
    type: String,
    default: '100g'
  },
  isPublished: {
    type: Boolean,
    default: false
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  views: {
    type: Number,
    default: 0
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }]
}, {
  timestamps: true
});

// Index cho tìm kiếm
blogPostSchema.index({ title: 'text', content: 'text', tags: 'text' });
blogPostSchema.index({ category: 1, parentCategory: 1 });
blogPostSchema.index({ createdAt: -1 });

module.exports = mongoose.model('BlogPost', blogPostSchema); 