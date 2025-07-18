const mongoose = require('mongoose');

const mealSuggestionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  calories: {
    type: Number,
    required: true,
    min: 0
  },
  image: {
    type: String,
    required: true
  },
  // Nutrition info
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
  // Meal properties
  mealType: {
    type: String,
    required: true,
    enum: ['breakfast', 'lunch', 'dinner', 'snack']
  },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    default: 'medium'
  },
  prepTime: {
    type: Number, // in minutes
    min: 0
  },
  servings: {
    type: Number,
    default: 1,
    min: 1
  },
  // Dietary tags - expanded enum values
  tags: [{
    type: String,
    enum: [
      'vegetarian', 'vegan', 'gluten-free', 'dairy-free', 'low-carb', 'high-protein', 'keto', 'paleo',
      'traditional', 'quick', 'comfort-food', 'grilled', 'light', 'fresh', 'spicy', 'sweet', 'dessert',
      'healthy', 'high-fiber', 'filling', 'delicate', 'seafood', 'fried', 'mixed', 'street-food', 'crispy',
      'drink', 'refreshing'
    ]
  }],
  // Suitable for goals
  suitableForGoals: [{
    type: String,
    enum: ['lose', 'maintain', 'gain'],
    default: ['maintain']
  }],
  // Ingredients (optional)
  ingredients: [{
    name: String,
    amount: String,
    unit: String
  }],
  // Instructions (optional)
  instructions: [String],
  // Metadata
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  featured: {
    type: Boolean,
    default: false
  },
  views: {
    type: Number,
    default: 0
  },
  likes: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Index để tìm kiếm và filter
mealSuggestionSchema.index({ title: 'text', description: 'text' });
mealSuggestionSchema.index({ mealType: 1, calories: 1 });
mealSuggestionSchema.index({ suitableForGoals: 1 });
mealSuggestionSchema.index({ tags: 1 });
mealSuggestionSchema.index({ featured: -1, createdAt: -1 });

// Virtual để tính protein per calorie ratio
mealSuggestionSchema.virtual('proteinRatio').get(function() {
  return this.calories > 0 ? Math.round((this.protein * 4 / this.calories) * 100) : 0;
});

module.exports = mongoose.model('MealSuggestion', mealSuggestionSchema); 