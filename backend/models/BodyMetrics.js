const mongoose = require('mongoose');

const bodyMetricsSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  height: {
    type: Number,
    required: true,
    min: 50,
    max: 300
  },
  weight: {
    type: Number,
    required: true,
    min: 10,
    max: 500
  },
  age: {
    type: Number,
    required: true,
    min: 1,
    max: 150
  },
  gender: {
    type: String,
    required: true,
    enum: ['male', 'female']
  },
  activityLevel: {
    type: String,
    required: true,
    enum: ['sedentary', 'light', 'moderate', 'active', 'veryActive']
  },
  // Calculated results
  bmi: {
    type: Number,
    required: true
  },
  bmiCategory: {
    type: String,
    required: true,
    enum: ['Thiếu cân', 'Bình thường', 'Thừa cân', 'Béo phì']
  },
  bmr: {
    type: Number,
    required: true
  },
  dailyCalories: {
    type: Number,
    required: true
  },
  idealWeightMin: {
    type: Number,
    required: true
  },
  idealWeightMax: {
    type: Number,
    required: true
  },
  notes: {
    type: String,
    maxlength: 500
  }
}, {
  timestamps: true
});

// Index để tìm kiếm nhanh theo user và thời gian
bodyMetricsSchema.index({ user: 1, createdAt: -1 });

module.exports = mongoose.model('BodyMetrics', bodyMetricsSchema); 