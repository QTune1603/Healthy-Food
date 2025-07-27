const mongoose = require('mongoose');
const connectDB = require('../config/database');

// Import models
const Dashboard = require('../models/Dashboard');
const HealthTrend = require('../models/HealthTrend');
const FoodDiary = require('../models/FoodDiary');
const BodyMetrics = require('../models/BodyMetrics');
const CalorieCalculation = require('../models/CalorieCalculation');
const Food = require('../models/Food');
const User = require('../models/User');

const targetUserId = new mongoose.Types.ObjectId('686a32b42bf267cc23846bb6');

// Helper functions
const getDateDaysAgo = (days) => {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date;
};

const calculateBMI = (weight, height) => {
  const heightInM = height / 100;
  return Math.round((weight / (heightInM * heightInM)) * 10) / 10;
};

const calculateBMR = (weight, height, age, gender) => {
  if (gender === 'male') {
    return Math.round(10 * weight + 6.25 * height - 5 * age + 5);
  } else {
    return Math.round(10 * weight + 6.25 * height - 5 * age - 161);
  }
};

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

const generateWeightProgression = (startWeight, endWeight, days) => {
  const progression = [];
  const weightDifference = endWeight - startWeight;
  
  for (let i = 0; i < days; i++) {
    const progress = i / days;
    const baseWeight = startWeight + (weightDifference * progress);
    const randomVariation = (Math.random() - 0.5) * 1; // ±0.5kg random variation
    progression.push(Math.max(50, baseWeight + randomVariation));
  }
  
  return progression;
};

const generateHealthProgression = (startScore, endScore, days) => {
  const progression = [];
  const scoreDifference = endScore - startScore;
  
  for (let i = 0; i < days; i++) {
    const progress = i / days;
    const baseScore = startScore + (scoreDifference * progress);
    const randomVariation = (Math.random() - 0.5) * 10; // ±5 points random variation
    progression.push(Math.max(50, Math.min(100, Math.round(baseScore + randomVariation))));
  }
  
  return progression;
};

const generateDayMealEntries = (foods, targetCalories) => {
  const entries = [];
  const mealDistribution = {
    breakfast: 0.25,
    lunch: 0.35,
    dinner: 0.30,
    snack: 0.10
  };

  for (const [mealType, percentage] of Object.entries(mealDistribution)) {
    const mealCalories = targetCalories * percentage;
    const numItems = Math.floor(Math.random() * 3) + 1;
    let remainingCalories = mealCalories;

    for (let i = 0; i < numItems && remainingCalories > 50; i++) {
      const food = foods[Math.floor(Math.random() * foods.length)];
      
      if (!food.caloriesPer100g || food.caloriesPer100g === 0) {
        continue;
      }
      
      const caloriesForThisItem = i === numItems - 1 ? remainingCalories : remainingCalories * (0.3 + Math.random() * 0.4);
      const quantity = Math.round((caloriesForThisItem / food.caloriesPer100g) * 100);
      
      if (quantity > 0) {
        const actualCalories = Math.round((quantity / 100) * food.caloriesPer100g);
        const actualProtein = Math.round((quantity / 100) * (food.protein || 0) * 10) / 10;
        const actualCarbs = Math.round((quantity / 100) * (food.carbs || 0) * 10) / 10;
        const actualFat = Math.round((quantity / 100) * (food.fat || 0) * 10) / 10;
        
        if (isNaN(actualCalories) || isNaN(actualProtein) || isNaN(actualCarbs) || isNaN(actualFat)) {
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
  }
  
  return entries;
};

const seedUserData = async () => {
  try {
    await connectDB();
    
    console.log('🌱 Starting user-specific dashboard seeder...');
    console.log('Target User ID:', targetUserId);
    
    // Check if user exists
    const user = await User.findById(targetUserId);
    if (!user) {
      console.error('❌ User not found:', targetUserId);
      process.exit(1);
    }
    
    console.log('👤 User found:', user.fullName, '(' + user.email + ')');
    
    // Clear existing dashboard data for this user
    console.log('🗑️ Clearing existing dashboard data...');
    await Dashboard.deleteMany({ userId: targetUserId });
    await HealthTrend.deleteMany({ userId: targetUserId });
    await FoodDiary.deleteMany({ user: targetUserId });
    await BodyMetrics.deleteMany({ user: targetUserId });
    await CalorieCalculation.deleteMany({ user: targetUserId });
    
    console.log('✅ Cleared existing data');
    
    // Get all foods
    const foods = await Food.find({ isActive: true });
    if (foods.length === 0) {
      console.error('❌ No foods found. Please run meal suggestion seeder first.');
      process.exit(1);
    }
    
    console.log('🍎 Found', foods.length, 'food items');
    
    // User characteristics
    const birthDate = user.dateOfBirth || '1990-01-01';
    const userAge = Math.max(1, new Date().getFullYear() - new Date(birthDate).getFullYear());
    const initialWeight = 75;
    const targetWeight = 70;
    const height = 170;
    const activityLevel = 'moderate';
    const dashboardActivityLevel = 'moderately_active';
    
    console.log('📊 User profile: Age', userAge, '- Weight progression:', initialWeight + 'kg →', targetWeight + 'kg');
    
    // Generate progressions
    const weightProgression = generateWeightProgression(initialWeight, targetWeight, 365);
    const healthScores = generateHealthProgression(65, 85, 365);
    
    // Create CalorieCalculation (latest)
    console.log('🧮 Creating calorie calculation...');
    const calorieCalc = new CalorieCalculation({
      user: targetUserId,
      height,
      weight: targetWeight,
      age: userAge,
      gender: user.gender || 'male',
      activityLevel: 'moderate',
      goal: 'lose',
      bmr: calculateBMR(targetWeight, height, userAge, user.gender || 'male'),
      maintenanceCalories: calculateDailyCalories(calculateBMR(targetWeight, height, userAge, user.gender || 'male'), 'moderate'),
      targetCalories: calculateDailyCalories(calculateBMR(targetWeight, height, userAge, user.gender || 'male'), 'moderate') - 500,
      goalDescription: 'Giảm cân (0.5kg/tuần)',
      protein: Math.round((calculateDailyCalories(calculateBMR(targetWeight, height, userAge, user.gender || 'male'), 'moderate') - 500) * 0.25 / 4),
      carbs: Math.round((calculateDailyCalories(calculateBMR(targetWeight, height, userAge, user.gender || 'male'), 'moderate') - 500) * 0.45 / 4),
      fats: Math.round((calculateDailyCalories(calculateBMR(targetWeight, height, userAge, user.gender || 'male'), 'moderate') - 500) * 0.30 / 9)
    });
    await calorieCalc.save();
    console.log('✅ Created calorie calculation');
    
    // Create BodyMetrics data (12 months)
    console.log('📊 Creating body metrics data...');
    const bodyMetricsData = [];
    for (let i = 0; i < 12; i++) {
      const date = getDateDaysAgo(30 * i);
      const weight = weightProgression[30 * i] || targetWeight;
      const bmi = calculateBMI(weight, height);
      const bmr = calculateBMR(weight, height, userAge, user.gender || 'male');
      const dailyCalories = calculateDailyCalories(bmr, activityLevel);
      
      let bmiCategory = 'Bình thường';
      if (bmi < 18.5) bmiCategory = 'Thiếu cân';
      else if (bmi >= 25 && bmi < 30) bmiCategory = 'Thừa cân';
      else if (bmi >= 30) bmiCategory = 'Béo phì';
      
      bodyMetricsData.push({
        user: targetUserId,
        height,
        weight,
        age: userAge,
        gender: user.gender || 'male',
        activityLevel,
        bmi,
        bmiCategory,
        bmr,
        dailyCalories,
        idealWeightMin: Math.round(18.5 * (height/100) * (height/100)),
        idealWeightMax: Math.round(24.9 * (height/100) * (height/100)),
        createdAt: date,
        updatedAt: date
      });
    }
    
    const bodyMetrics = await BodyMetrics.insertMany(bodyMetricsData);
    console.log('✅ Created', bodyMetrics.length, 'body metrics records');
    
    // Create HealthTrend data (12 months)
    console.log('📈 Creating health trend data...');
    const healthTrendData = [];
    for (let i = 0; i < 12; i++) {
      const date = getDateDaysAgo(30 * i);
      const weight = weightProgression[30 * i] || targetWeight;
      const bmi = calculateBMI(weight, height);
      const overallScore = healthScores[30 * i] || 75;
      
      healthTrendData.push({
        userId: targetUserId,
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
          waterGoal: Math.max(50, Math.min(100, overallScore + Math.random() * 20 - 10)),
          sleepGoal: Math.max(60, Math.min(100, overallScore + Math.random() * 15 - 8)),
          weightGoal: Math.max(70, Math.min(100, overallScore + Math.random() * 10 - 5))
        },
        createdAt: date,
        updatedAt: date
      });
    }
    
    const healthTrends = await HealthTrend.insertMany(healthTrendData);
    console.log('✅ Created', healthTrends.length, 'health trend records');
    
    // Create FoodDiary data (30 days)
    console.log('🍽️ Creating food diary data...');
    const targetDailyCalories = calorieCalc.targetCalories;
    
    const foodDiaryData = [];
    for (let i = 0; i < 30; i++) {
      const date = getDateDaysAgo(i);
      const entries = generateDayMealEntries(foods, targetDailyCalories * (0.8 + Math.random() * 0.4));
      
      if (entries.length > 0) {
        const foodDiary = {
          user: targetUserId,
          date,
          entries,
          totalCalories: entries.reduce((sum, entry) => sum + entry.calories, 0),
          totalProtein: entries.reduce((sum, entry) => sum + entry.protein, 0),
          totalCarbs: entries.reduce((sum, entry) => sum + entry.carbs, 0),
          totalFat: entries.reduce((sum, entry) => sum + entry.fat, 0),
          totalFiber: Math.round(entries.reduce((sum, entry) => sum + entry.calories, 0) * 0.014),
          createdAt: date,
          updatedAt: date
        };
        
        foodDiaryData.push(foodDiary);
      }
    }
    
    const foodDiaries = await FoodDiary.insertMany(foodDiaryData);
    console.log('✅ Created', foodDiaries.length, 'food diary records');
    
    // Create Dashboard data (30 days)
    console.log('📊 Creating dashboard data...');
    const dashboardData = [];
    
    for (let i = 0; i < 30; i++) {
      const date = getDateDaysAgo(i);
      const weight = weightProgression[i] || targetWeight;
      const bmi = calculateBMI(weight, height);
      const healthScore = healthScores[i] || 75;
      
      const dayFoodDiary = foodDiaries.find(diary => 
        diary.date.toDateString() === date.toDateString()
      ) || { totalCalories: 0, totalProtein: 0, totalCarbs: 0, totalFat: 0 };
      
      // Generate realistic daily activities
      const waterIntake = 1500 + Math.random() * 1000;
      const exerciseMinutes = Math.random() * 60 + 20;
      const steps = 5000 + Math.random() * 8000;
      const sleep = 6.5 + Math.random() * 2;
      
      // Calculate scores
      const nutritionScore = Math.min(100, (dayFoodDiary.totalCalories / targetDailyCalories) * 100);
      const exerciseScore = Math.min(100, (exerciseMinutes / 30) * 100);
      const hydrationScore = Math.min(100, (waterIntake / 2000) * 100);
      const sleepScore = sleep >= 7 && sleep <= 9 ? 100 : Math.max(50, 100 - Math.abs(8 - sleep) * 20);
      const weightScore = Math.max(50, 100 - Math.abs(weight - targetWeight) * 10);
      const overallScore = Math.round((nutritionScore + exerciseScore + hydrationScore + sleepScore + weightScore) / 5);
      
      dashboardData.push({
        userId: targetUserId,
        date,
        stats: {
          totalCalories: dayFoodDiary.totalCalories,
          targetCalories: targetDailyCalories,
          totalProtein: dayFoodDiary.totalProtein,
          totalCarbs: dayFoodDiary.totalCarbs,
          totalFat: dayFoodDiary.totalFat,
          totalFiber: Math.round(dayFoodDiary.totalCalories * 0.014),
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
          activityLevel: dashboardActivityLevel,
          healthScore: Math.round(healthScore)
        },
        scores: {
          nutrition: Math.round(nutritionScore),
          exercise: Math.round(exerciseScore),
          hydration: Math.round(hydrationScore),
          sleep: Math.round(sleepScore),
          weight: Math.round(weightScore),
          overall: overallScore
        },
        createdAt: date,
        updatedAt: date
      });
    }
    
    const dashboards = await Dashboard.insertMany(dashboardData);
    console.log('✅ Created', dashboards.length, 'dashboard records');
    
    console.log('\n🎉 User-specific dashboard seeder completed successfully!');
    
    console.log('\n📋 Summary:');
    console.log('👤 User:', user.fullName, '(' + user.email + ')');
    console.log('📊 Body Metrics:', bodyMetrics.length, 'records (12 months)');
    console.log('📈 Health Trends:', healthTrends.length, 'records (12 months)');
    console.log('🍽️ Food Diaries:', foodDiaries.length, 'records (30 days)');
    console.log('📊 Dashboard:', dashboards.length, 'records (30 days)');
    console.log('🧮 Calorie Calculation: 1 record');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding user data:', error);
    process.exit(1);
  }
};

// Run the seeder if called directly
if (require.main === module) {
  seedUserData();
}

module.exports = seedUserData;