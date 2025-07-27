const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const connectDB = require('../config/database');

// Import models
const User = require('../models/User');
const Dashboard = require('../models/Dashboard');
const HealthTrend = require('../models/HealthTrend');
const BodyMetrics = require('../models/BodyMetrics');
const FoodDiary = require('../models/FoodDiary');
const Food = require('../models/Food');

// Vietnamese food data with realistic nutrition values
const vietnameseFoods = [
  // Protein sources
  {
    name: 'Thịt heo nạc',
    category: 'protein',
    caloriesPer100g: 143,
    protein: 21.0,
    carbs: 0,
    fat: 6.0,
    fiber: 0,
    sugar: 0,
    sodium: 62
  },
  {
    name: 'Thịt bò nạc',
    category: 'protein',
    caloriesPer100g: 250,
    protein: 26.0,
    carbs: 0,
    fat: 15.0,
    fiber: 0,
    sugar: 0,
    sodium: 55
  },
  {
    name: 'Cá thu',
    category: 'protein',
    caloriesPer100g: 184,
    protein: 25.4,
    carbs: 0,
    fat: 8.1,
    fiber: 0,
    sugar: 0,
    sodium: 59
  },
  {
    name: 'Tôm sú',
    category: 'protein',
    caloriesPer100g: 99,
    protein: 20.3,
    carbs: 0.9,
    fat: 1.4,
    fiber: 0,
    sugar: 0,
    sodium: 111
  },
  {
    name: 'Trứng gà',
    category: 'protein',
    caloriesPer100g: 155,
    protein: 13.0,
    carbs: 1.1,
    fat: 11.0,
    fiber: 0,
    sugar: 1.1,
    sodium: 124
  },
  {
    name: 'Đậu phụ',
    category: 'protein',
    caloriesPer100g: 76,
    protein: 8.0,
    carbs: 1.9,
    fat: 4.8,
    fiber: 0.3,
    sugar: 0.6,
    sodium: 7
  },

  // Vegetables
  {
    name: 'Rau muống',
    category: 'vegetables',
    caloriesPer100g: 19,
    protein: 2.6,
    carbs: 3.1,
    fat: 0.2,
    fiber: 2.1,
    sugar: 1.8,
    sodium: 113
  },
  {
    name: 'Cải thảo',
    category: 'vegetables',
    caloriesPer100g: 13,
    protein: 1.5,
    carbs: 2.2,
    fat: 0.2,
    fiber: 1.2,
    sugar: 1.2,
    sodium: 9
  },
  {
    name: 'Cà chua',
    category: 'vegetables',
    caloriesPer100g: 18,
    protein: 0.9,
    carbs: 3.9,
    fat: 0.2,
    fiber: 1.2,
    sugar: 2.6,
    sodium: 5
  },
  {
    name: 'Dưa chuột',
    category: 'vegetables',
    caloriesPer100g: 15,
    protein: 0.7,
    carbs: 3.6,
    fat: 0.1,
    fiber: 0.5,
    sugar: 1.7,
    sodium: 2
  },

  // Fruits
  {
    name: 'Chuối',
    category: 'fruits',
    caloriesPer100g: 89,
    protein: 1.1,
    carbs: 22.8,
    fat: 0.3,
    fiber: 2.6,
    sugar: 12.2,
    sodium: 1
  },
  {
    name: 'Cam',
    category: 'fruits',
    caloriesPer100g: 47,
    protein: 0.9,
    carbs: 11.8,
    fat: 0.1,
    fiber: 2.4,
    sugar: 9.4,
    sodium: 0
  },
  {
    name: 'Xoài',
    category: 'fruits',
    caloriesPer100g: 60,
    protein: 0.8,
    carbs: 15.0,
    fat: 0.4,
    fiber: 1.6,
    sugar: 13.7,
    sodium: 1
  },

  // Grains
  {
    name: 'Cơm trắng',
    category: 'grains',
    caloriesPer100g: 130,
    protein: 2.7,
    carbs: 28.0,
    fat: 0.3,
    fiber: 0.4,
    sugar: 0.1,
    sodium: 1
  },
  {
    name: 'Bánh mì',
    category: 'grains',
    caloriesPer100g: 265,
    protein: 9.0,
    carbs: 49.0,
    fat: 3.2,
    fiber: 2.7,
    sugar: 5.0,
    sodium: 491
  },
  {
    name: 'Phở',
    category: 'grains',
    caloriesPer100g: 85,
    protein: 1.7,
    carbs: 19.0,
    fat: 0.2,
    fiber: 0.9,
    sugar: 0.2,
    sodium: 3
  },

  // Beverages
  {
    name: 'Nước lọc',
    category: 'beverages',
    caloriesPer100g: 1,
    protein: 0,
    carbs: 0,
    fat: 0,
    fiber: 0,
    sugar: 0,
    sodium: 0
  },
  {
    name: 'Trà xanh',
    category: 'beverages',
    caloriesPer100g: 1,
    protein: 0,
    carbs: 0.3,
    fat: 0,
    fiber: 0,
    sugar: 0,
    sodium: 1
  }
];

// Helper function to generate dates
const getDateDaysAgo = (days) => {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date;
};

// Helper function to generate realistic score progression
const generateScoreProgression = (startScore, endScore, dataPoints) => {
  const scores = [];
  const increment = (endScore - startScore) / (dataPoints - 1);
  
  for (let i = 0; i < dataPoints; i++) {
    const baseScore = startScore + (increment * i);
    // Add some realistic variation (+/- 5 points)
    const variation = (Math.random() - 0.5) * 10;
    const score = Math.max(0, Math.min(100, Math.round(baseScore + variation)));
    scores.push(score);
  }
  
  return scores;
};

// Helper function to generate realistic weight progression
const generateWeightProgression = (startWeight, targetWeight, dataPoints) => {
  const weights = [];
  const totalChange = targetWeight - startWeight;
  
  for (let i = 0; i < dataPoints; i++) {
    const progress = i / (dataPoints - 1);
    // Non-linear progression (faster at start, slower later)
    const adjustedProgress = 1 - Math.pow(1 - progress, 1.5);
    const weight = startWeight + (totalChange * adjustedProgress);
    // Add realistic daily fluctuation (+/- 0.5kg)
    const fluctuation = (Math.random() - 0.5) * 1;
    weights.push(Math.round((weight + fluctuation) * 10) / 10);
  }
  
  return weights;
};

// Helper function to calculate BMI
const calculateBMI = (weight, height) => {
  return Math.round((weight / Math.pow(height / 100, 2)) * 10) / 10;
};

// Helper function to calculate BMR (Mifflin-St Jeor Equation)
const calculateBMR = (weight, height, age, gender) => {
  if (gender === 'male') {
    return Math.round(10 * weight + 6.25 * height - 5 * age + 5);
  } else {
    return Math.round(10 * weight + 6.25 * height - 5 * age - 161);
  }
};

// Helper function to calculate daily calories based on activity level
const calculateDailyCalories = (bmr, activityLevel) => {
  const multipliers = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    active: 1.725,
    veryActive: 1.9
  };
  return Math.round(bmr * multipliers[activityLevel]);
};

// Helper function to generate meal entries for a day
const generateDayMealEntries = (foods, targetCalories) => {
  const mealTypes = ['breakfast', 'lunch', 'dinner', 'snack'];
  const mealDistribution = {
    breakfast: 0.25,
    lunch: 0.35,
    dinner: 0.30,
    snack: 0.10
  };
  
  const entries = [];
  
  mealTypes.forEach(mealType => {
    const mealCalories = targetCalories * mealDistribution[mealType];
    let remainingCalories = mealCalories;
    
    // Generate 1-3 food items per meal
    const numItems = Math.floor(Math.random() * 3) + 1;
    
    for (let i = 0; i < numItems && remainingCalories > 50; i++) {
      const food = foods[Math.floor(Math.random() * foods.length)];
      const caloriesForThisItem = i === numItems - 1 ? remainingCalories : remainingCalories * (0.3 + Math.random() * 0.4);
      
      // Validate food data
      if (!food.caloriesPer100g || food.caloriesPer100g === 0) {
        console.warn(`⚠️  Skipping food ${food.name} - invalid calories`);
        continue;
      }
      
      const quantity = Math.round((caloriesForThisItem / food.caloriesPer100g) * 100);
      
      if (quantity > 0) {
        const actualCalories = Math.round((quantity / 100) * food.caloriesPer100g);
        const actualProtein = Math.round((quantity / 100) * (food.protein || 0) * 10) / 10;
        const actualCarbs = Math.round((quantity / 100) * (food.carbs || 0) * 10) / 10;
        const actualFat = Math.round((quantity / 100) * (food.fat || 0) * 10) / 10;
        
        // Validate calculated values
        if (isNaN(actualCalories) || isNaN(actualProtein) || isNaN(actualCarbs) || isNaN(actualFat)) {
          console.warn(`⚠️  Skipping food ${food.name} - NaN values calculated`);
          continue;
        }
        
        entries.push({
          food: food._id,
          foodName: food.name,
          quantity,
          unit: 'g',
          calories: actualCalories,
          protein: actualProtein,
          carbs: actualCarbs,
          fat: actualFat,
          mealType
        });
        
        remainingCalories -= actualCalories;
      }
    }
  });
  
  return entries;
};

const seedDashboardData = async () => {
  try {
    console.log('🌱 Starting dashboard seeder...');
    
    // Connect to database
    await connectDB();
    
    // Clear existing data
    console.log('🗑️  Clearing existing data...');
    await Dashboard.deleteMany({});
    await HealthTrend.deleteMany({});
    await BodyMetrics.deleteMany({});
    await FoodDiary.deleteMany({});
    await Food.deleteMany({});
    
    // Find or create test user
    let testUser = await User.findOne({ email: 'test@example.com' });
    if (!testUser) {
      console.log('👤 Creating test user...');
      const hashedPassword = await bcrypt.hash('123456', 10);
      testUser = await User.create({
        fullName: 'Nguyễn Văn An',
        email: 'test@example.com',
        password: hashedPassword,
        phone: '0123456789',
        gender: 'male',
        dateOfBirth: new Date('1990-05-15'),
        address: 'Hà Nội, Việt Nam',
        role: 'user'
      });
    }
    
    // Create food items
    console.log('🍎 Creating food items...');
    const foods = await Food.insertMany(vietnameseFoods);
    console.log('✅ Created ${foods.length} food items');
    
    // User characteristics for calculations
    console.log('🔍 Test user:', { id: testUser._id, dateOfBirth: testUser.dateOfBirth, gender: testUser.gender });
    const userAge = new Date().getFullYear() - new Date(testUser.dateOfBirth).getFullYear();
    console.log('📅 User age calculated:', userAge);
    const initialWeight = 75;
    const targetWeight = 70;
    const height = 170;
    const activityLevel = 'moderate';
    
    // Generate weight progression over 12 months
    const weightProgression = generateWeightProgression(initialWeight, targetWeight, 365);
    
    // Generate health score progression (gradual improvement)
    const healthScores = generateScoreProgression(65, 85, 365);
    
    // Create BodyMetrics data (monthly updates for last 12 months)
    console.log('📊 Creating body metrics data...');
    const bodyMetricsData = [];
    for (let i = 0; i < 12; i++) {
      const date = getDateDaysAgo(30 * i);
      const weight = weightProgression[30 * i] || targetWeight;
      const bmi = calculateBMI(weight, height);
      const bmr = calculateBMR(weight, height, userAge, testUser.gender);
      const dailyCalories = calculateDailyCalories(bmr, activityLevel);
      
      let bmiCategory = 'Bình thường';
      if (bmi < 18.5) bmiCategory = 'Thiếu cân';
      else if (bmi >= 25 && bmi < 30) bmiCategory = 'Thừa cân';
      else if (bmi >= 30) bmiCategory = 'Béo phì';
      
      bodyMetricsData.push({
        user: testUser._id,
        height,
        weight,
        age: userAge,
        gender: testUser.gender,
        activityLevel,
        bmi,
        bmiCategory,
        bmr,
        dailyCalories,
        idealWeightMin: Math.round(18.5 * Math.pow(height / 100, 2)),
        idealWeightMax: Math.round(24.9 * Math.pow(height / 100, 2)),
        notes: `Cập nhật tháng ${12 - i}`,
        createdAt: date,
        updatedAt: date
      });
    }
    
    const bodyMetrics = await BodyMetrics.insertMany(bodyMetricsData);
    console.log(`✅ Created ${bodyMetrics.length} body metrics records`);
    
    // Create HealthTrend data (monthly for last 12 months)
    console.log('📈 Creating health trend data...');
    const healthTrendData = [];
    for (let i = 0; i < 12; i++) {
      const date = getDateDaysAgo(30 * i);
      const weight = weightProgression[30 * i] || targetWeight;
      const bmi = calculateBMI(weight, height);
      const overallScore = healthScores[30 * i] || 75;
      
      healthTrendData.push({
        userId: testUser._id,
        period: 'monthly',
        date,
        healthMetrics: {
          weight,
          bmi,
          bodyFatPercentage: Math.max(8, Math.min(25, 15 + (weight - targetWeight) * 0.5)),
          muscleMass: Math.max(30, Math.min(50, 40 - (weight - targetWeight) * 0.3)),
          metabolicAge: Math.max(20, Math.min(45, userAge + (weight - targetWeight) * 0.2)),
          visceralFatLevel: Math.max(1, Math.min(12, 5 + (weight - targetWeight) * 0.1))
        },
        overallScore,
        activityMetrics: {
          averageCaloriesConsumed: 1800 + Math.random() * 400,
          averageCaloriesBurned: 2200 + Math.random() * 300,
          exerciseDays: Math.floor(Math.random() * 8) + 15,
          averageSteps: 8000 + Math.random() * 4000,
          averageSleepHours: 7 + Math.random() * 1.5,
          waterIntakeGoalDays: Math.floor(Math.random() * 10) + 20
        },
        nutritionTrends: {
          protein: 80 + Math.random() * 40,
          carbs: 200 + Math.random() * 100,
          fat: 60 + Math.random() * 30,
          fiber: 20 + Math.random() * 15,
          sugar: 40 + Math.random() * 20,
          sodium: 1500 + Math.random() * 1000
        },
        goalAchievements: {
          calorieGoal: Math.max(60, Math.min(100, overallScore + Math.random() * 20 - 10)),
          proteinGoal: Math.max(50, Math.min(100, overallScore + Math.random() * 30 - 15)),
          exerciseGoal: Math.max(40, Math.min(100, overallScore + Math.random() * 25 - 12)),
          waterGoal: Math.max(70, Math.min(100, overallScore + Math.random() * 20 - 10)),
          sleepGoal: Math.max(60, Math.min(100, overallScore + Math.random() * 25 - 12)),
          weightGoal: Math.max(50, Math.min(100, 100 - Math.abs(weight - targetWeight) * 10))
        }
      });
    }
    
    const healthTrends = await HealthTrend.insertMany(healthTrendData);
    console.log(`✅ Created ${healthTrends.length} health trend records`);
    
    // Create FoodDiary data for last 30 days
    console.log('🍽️  Creating food diary data...');
    const targetDailyCalories = calculateDailyCalories(
      calculateBMR(targetWeight, height, userAge, testUser.gender),
      activityLevel
    );
    
    const foodDiaryData = [];
    for (let i = 0; i < 30; i++) {
      const date = getDateDaysAgo(i);
      const entries = generateDayMealEntries(foods, targetDailyCalories * (0.8 + Math.random() * 0.4));
      
      const totalCalories = entries.reduce((sum, entry) => sum + entry.calories, 0);
      const totalProtein = entries.reduce((sum, entry) => sum + entry.protein, 0);
      const totalCarbs = entries.reduce((sum, entry) => sum + entry.carbs, 0);
      const totalFat = entries.reduce((sum, entry) => sum + entry.fat, 0);
      
      foodDiaryData.push({
        user: testUser._id,
        date,
        entries,
        totalCalories,
        totalProtein,
        totalCarbs,
        totalFat,
        notes: i < 7 ? `Ngày ${i + 1} - Tuần gần nhất` : undefined
      });
    }
    
    const foodDiaries = await FoodDiary.insertMany(foodDiaryData);
    console.log(`✅ Created ${foodDiaries.length} food diary records`);
    
    // Create Dashboard data for last 30 days
    console.log('📊 Creating dashboard data...');
    const dashboardData = [];
    for (let i = 0; i < 30; i++) {
      const date = getDateDaysAgo(i);
      const weight = weightProgression[i] || targetWeight;
      const bmi = calculateBMI(weight, height);
      const healthScore = healthScores[i] || 75;
      
      // Get corresponding food diary for nutrition stats
      const dayFoodDiary = foodDiaryData[i];
      
      // Generate realistic activity data
      const steps = 6000 + Math.random() * 8000;
      const exerciseMinutes = Math.random() * 90;
      const waterIntake = 1500 + Math.random() * 1000;
      const sleep = 6.5 + Math.random() * 2;
      
      // Calculate scores based on targets
      const nutritionScore = Math.min(100, Math.max(0, 
        (dayFoodDiary.totalProtein / (targetDailyCalories * 0.15 / 4)) * 30 +
        (Math.min(dayFoodDiary.totalCalories, targetDailyCalories) / targetDailyCalories) * 70
      ));
      
      const exerciseScore = Math.min(100, (exerciseMinutes / 30) * 60 + (steps / 10000) * 40);
      const hydrationScore = Math.min(100, (waterIntake / 2000) * 100);
      const sleepScore = Math.min(100, Math.max(0, 100 - Math.abs(sleep - 8) * 15));
      const weightScore = Math.min(100, Math.max(0, 100 - Math.abs(weight - targetWeight) * 10));
      const overallScore = Math.round((nutritionScore + exerciseScore + hydrationScore + sleepScore + weightScore) / 5);
      
      dashboardData.push({
        userId: testUser._id,
        date,
        stats: {
          totalCalories: dayFoodDiary.totalCalories,
          targetCalories: targetDailyCalories,
          totalProtein: dayFoodDiary.totalProtein,
          totalCarbs: dayFoodDiary.totalCarbs,
          totalFat: dayFoodDiary.totalFat,
          totalFiber: Math.round(dayFoodDiary.totalCalories * 0.014), // Rough fiber estimate
          waterIntake: Math.round(waterIntake),
          exerciseMinutes: Math.round(exerciseMinutes),
          steps: Math.round(steps),
          sleep: Math.round(sleep * 10) / 10
        },
        bodyMetrics: {
          weight,
          height,
          bmi,
          age: userAge,
          activityLevel: 'moderately_active', // Dashboard enum format
          healthScore: Math.round(healthScore)
        },
        scores: {
          nutrition: Math.round(nutritionScore),
          exercise: Math.round(exerciseScore),
          hydration: Math.round(hydrationScore),
          sleep: Math.round(sleepScore),
          weight: Math.round(weightScore),
          overall: overallScore
        }
      });
    }
    
    const dashboards = await Dashboard.insertMany(dashboardData);
    console.log(`✅ Created ${dashboards.length} dashboard records`);
    
    console.log('\n🎉 Dashboard seeder completed successfully!');
    console.log('\n📋 Summary:');
    console.log(`👤 Test User: ${testUser.fullName} (${testUser.email})`);
    console.log(`🍎 Foods: ${foods.length} items`);
    console.log(`📊 Body Metrics: ${bodyMetrics.length} records (12 months)`);
    console.log(`📈 Health Trends: ${healthTrends.length} records (12 months)`);
    console.log(`🍽️  Food Diaries: ${foodDiaries.length} records (30 days)`);
    console.log(`📊 Dashboard: ${dashboards.length} records (30 days)`);
    console.log('\n🔗 Test user credentials:');
    console.log('Email: test@example.com');
    console.log('Password: 123456');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding dashboard data:', error);
    process.exit(1);
  }
};

// Run the seeder if called directly
if (require.main === module) {
  seedDashboardData();
}

module.exports = seedDashboardData;