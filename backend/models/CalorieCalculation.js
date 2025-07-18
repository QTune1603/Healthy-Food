const mongoose = require('mongoose');

const calorieCalculationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  // Input data
  height: {
    type: Number,
    required: true,
    min: 50,
    max: 300
  },
  weight: {
    type: Number,
    required: true,
    min: 20,
    max: 500
  },
  age: {
    type: Number,
    required: true,
    min: 1,
    max: 120
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
  goal: {
    type: String,
    required: true,
    enum: ['lose', 'maintain', 'gain']
  },
  // Calculated results
  bmr: {
    type: Number,
    required: true
  },
  maintenanceCalories: {
    type: Number,
    required: true
  },
  targetCalories: {
    type: Number,
    required: true
  },
  goalDescription: {
    type: String,
    required: true
  },
  // Macronutrient breakdown
  protein: {
    type: Number,
    required: true
  },
  carbs: {
    type: Number,
    required: true
  },
  fats: {
    type: Number,
    required: true
  },
  // Additional info
  bmi: {
    type: Number
  },
  bmiCategory: {
    type: String,
    enum: ['underweight', 'normal', 'overweight', 'obese']
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Index để tìm kiếm nhanh theo user và ngày
calorieCalculationSchema.index({ user: 1, createdAt: -1 });

// Method để tính BMI
calorieCalculationSchema.methods.calculateBMI = function() {
  const heightInM = this.height / 100;
  this.bmi = Math.round((this.weight / (heightInM * heightInM)) * 10) / 10;
  
  if (this.bmi < 18.5) {
    this.bmiCategory = 'underweight';
  } else if (this.bmi < 25) {
    this.bmiCategory = 'normal';
  } else if (this.bmi < 30) {
    this.bmiCategory = 'overweight';
  } else {
    this.bmiCategory = 'obese';
  }
};

// Pre-save middleware để tính BMI
calorieCalculationSchema.pre('save', function(next) {
  this.calculateBMI();
  next();
});

module.exports = mongoose.model('CalorieCalculation', calorieCalculationSchema); 