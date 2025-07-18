const mongoose = require('mongoose');

const healthTrendSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  period: {
    type: String,
    enum: ['daily', 'weekly', 'monthly'],
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  // Dữ liệu cho line chart
  healthMetrics: {
    weight: { type: Number, default: 0 },
    bmi: { type: Number, default: 0 },
    bodyFatPercentage: { type: Number, default: 0 },
    muscleMass: { type: Number, default: 0 },
    metabolicAge: { type: Number, default: 0 },
    visceralFatLevel: { type: Number, default: 0 }
  },
  // Điểm số tổng hợp (0-100)
  overallScore: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  // Thống kê hoạt động
  activityMetrics: {
    averageCaloriesConsumed: { type: Number, default: 0 },
    averageCaloriesBurned: { type: Number, default: 0 },
    exerciseDays: { type: Number, default: 0 },
    averageSteps: { type: Number, default: 0 },
    averageSleepHours: { type: Number, default: 0 },
    waterIntakeGoalDays: { type: Number, default: 0 }
  },
  // Nutrition trends
  nutritionTrends: {
    protein: { type: Number, default: 0 },
    carbs: { type: Number, default: 0 },
    fat: { type: Number, default: 0 },
    fiber: { type: Number, default: 0 },
    sugar: { type: Number, default: 0 },
    sodium: { type: Number, default: 0 }
  },
  // Goal achievement percentage
  goalAchievements: {
    calorieGoal: { type: Number, default: 0 }, // % đạt mục tiêu calo
    proteinGoal: { type: Number, default: 0 },
    exerciseGoal: { type: Number, default: 0 },
    waterGoal: { type: Number, default: 0 },
    sleepGoal: { type: Number, default: 0 },
    weightGoal: { type: Number, default: 0 }
  }
}, {
  timestamps: true
});

// Indexes
healthTrendSchema.index({ userId: 1, period: 1, date: -1 });
healthTrendSchema.index({ userId: 1, date: -1 });

// Static method để lấy trend data theo period
healthTrendSchema.statics.getTrendData = async function(userId, period = 'monthly', limit = 12) {
  return this.find({
    userId,
    period
  })
  .sort({ date: -1 })
  .limit(limit);
};

// Method tính overall score dựa trên các metrics
healthTrendSchema.methods.calculateOverallScore = function() {
  const { healthMetrics, goalAchievements } = this;
  
  // Tính điểm dựa trên BMI (25-30 = 100 points, giảm dần)
  let bmiScore = 100;
  if (healthMetrics.bmi > 25) {
    bmiScore = Math.max(0, 100 - (healthMetrics.bmi - 25) * 10);
  } else if (healthMetrics.bmi < 18.5) {
    bmiScore = Math.max(0, 100 - (18.5 - healthMetrics.bmi) * 15);
  }
  
  // Tính điểm dựa trên goal achievements
  const goalScore = Object.values(goalAchievements).reduce((sum, achievement) => sum + achievement, 0) / Object.keys(goalAchievements).length;
  
  // Tính điểm dựa trên body composition
  const bodyScore = Math.max(0, 100 - (healthMetrics.bodyFatPercentage || 0));
  
  this.overallScore = Math.round((bmiScore + goalScore + bodyScore) / 3);
  return this.overallScore;
};

module.exports = mongoose.model('HealthTrend', healthTrendSchema); 