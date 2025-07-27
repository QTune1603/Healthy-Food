const mongoose = require('mongoose');

const foodEntrySchema = new mongoose.Schema({
  food: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Food',
    required: true
  },
  foodName: {
    type: String,
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 0
  },
  unit: {
    type: String,
    required: true,
    default: 'g'
  },
  calories: {
    type: Number,
    required: true,
    min: 0
  },
  protein: {
    type: Number,
    default: 0
  },
  carbs: {
    type: Number,
    default: 0
  },
  fat: {
    type: Number,
    default: 0
  },
  mealType: {
    type: String,
    required: true,
    enum: ['breakfast', 'lunch', 'dinner', 'snack']
  }
}, {
  timestamps: true
});

const foodDiarySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  entries: [foodEntrySchema],
  totalCalories: {
    type: Number,
    default: 0
  },
  totalProtein: {
    type: Number,
    default: 0
  },
  totalCarbs: {
    type: Number,
    default: 0
  },
  totalFat: {
    type: Number,
    default: 0
  },
  notes: {
    type: String,
    maxlength: 500
  }
}, {
  timestamps: true
});

// Index để tìm kiếm nhanh theo user và ngày
foodDiarySchema.index({ user: 1, date: 1 }, { unique: true });

// Method để tính toán tổng dinh dưỡng
foodDiarySchema.methods.calculateTotals = function() {
  this.totalCalories = this.entries.reduce((sum, entry) => sum + entry.calories, 0);
  this.totalProtein = this.entries.reduce((sum, entry) => sum + entry.protein, 0);
  this.totalCarbs = this.entries.reduce((sum, entry) => sum + entry.carbs, 0);
  this.totalFat = this.entries.reduce((sum, entry) => sum + entry.fat, 0);
};

// Pre-save middleware để tự động tính toán totals
foodDiarySchema.pre('save', function(next) {
  this.calculateTotals();
  next();
});

module.exports = mongoose.model('FoodDiary', foodDiarySchema); 