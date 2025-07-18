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
    enum: ['protein', 'vegetables', 'fruits', 'grains', 'dairy', 'nuts', 'beverages', 'others']
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