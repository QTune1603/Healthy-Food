const mongoose = require('mongoose');

const dashboardSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  date: {
    type: Date,
    required: true,
    default: Date.now
  },
  // Thống kê cơ bản
  stats: {
    totalCalories: { type: Number, default: 0 },
    targetCalories: { type: Number, default: 0 },
    totalProtein: { type: Number, default: 0 },
    totalCarbs: { type: Number, default: 0 },
    totalFat: { type: Number, default: 0 },
    totalFiber: { type: Number, default: 0 },
    waterIntake: { type: Number, default: 0 }, // ml
    exerciseMinutes: { type: Number, default: 0 },
    steps: { type: Number, default: 0 },
    sleep: { type: Number, default: 0 } // hours
  },
  // Chỉ số cơ thể cho radar chart
  bodyMetrics: {
    weight: { type: Number, default: 0 },
    height: { type: Number, default: 0 },
    bmi: { type: Number, default: 0 },
    age: { type: Number, default: 0 },
    activityLevel: { 
      type: String, 
      enum: ['sedentary', 'lightly_active', 'moderately_active', 'very_active', 'extremely_active'],
      default: 'sedentary'
    },
    healthScore: { type: Number, default: 0, min: 0, max: 100 } // Điểm sức khỏe tổng quát
  },
  // Điểm số các chỉ tiêu (0-100)
  scores: {
    nutrition: { type: Number, default: 0, min: 0, max: 100 },
    exercise: { type: Number, default: 0, min: 0, max: 100 },
    hydration: { type: Number, default: 0, min: 0, max: 100 },
    sleep: { type: Number, default: 0, min: 0, max: 100 },
    weight: { type: Number, default: 0, min: 0, max: 100 },
    overall: { type: Number, default: 0, min: 0, max: 100 }
  }
}, {
  timestamps: true
});

// Index cho performance
dashboardSchema.index({ userId: 1, date: -1 });
dashboardSchema.index({ userId: 1, createdAt: -1 });

// Method tính điểm tổng thể
dashboardSchema.methods.calculateOverallScore = function() {
  const { nutrition, exercise, hydration, sleep, weight } = this.scores;
  this.scores.overall = Math.round((nutrition + exercise + hydration + sleep + weight) / 5);
  return this.scores.overall;
};

// Static method để lấy stats theo user và khoảng thời gian
dashboardSchema.statics.getStatsByPeriod = async function(userId, days = 30) {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  
  return this.find({
    userId,
    date: { $gte: startDate }
  }).sort({ date: -1 });
};

module.exports = mongoose.model('Dashboard', dashboardSchema); 