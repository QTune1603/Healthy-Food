const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const BodyMetrics = require('../models/BodyMetrics');

// Load env vars
dotenv.config();

// Connect to database
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected...');
  } catch (error) {
    console.error('Database connection error:', error);
    process.exit(1);
  }
};

// Utility function để tính toán BMI và các chỉ số
const calculateMetrics = (height, weight, age, gender, activityLevel) => {
  const heightInMeters = height / 100;
  const bmi = weight / (heightInMeters * heightInMeters);

  // Tính BMR (Basal Metabolic Rate)
  let bmr;
  if (gender === 'male') {
    bmr = 88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * age);
  } else {
    bmr = 447.593 + (9.247 * weight) + (3.098 * height) - (4.330 * age);
  }

  // Tính calo hàng ngày dựa trên mức độ hoạt động
  const activityMultipliers = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    active: 1.725,
    veryActive: 1.9
  };

  const dailyCalories = bmr * activityMultipliers[activityLevel];

  // Phân loại BMI
  let bmiCategory = '';
  if (bmi < 18.5) {
    bmiCategory = 'Thiếu cân';
  } else if (bmi < 25) {
    bmiCategory = 'Bình thường';
  } else if (bmi < 30) {
    bmiCategory = 'Thừa cân';
  } else {
    bmiCategory = 'Béo phì';
  }

  // Tính cân nặng lý tưởng
  const idealWeightMin = 18.5 * (heightInMeters * heightInMeters);
  const idealWeightMax = 24.9 * (heightInMeters * heightInMeters);

  return {
    bmi: Math.round(bmi * 10) / 10,
    bmiCategory,
    bmr: Math.round(bmr),
    dailyCalories: Math.round(dailyCalories),
    idealWeightMin: Math.round(idealWeightMin),
    idealWeightMax: Math.round(idealWeightMax)
  };
};

const seedBodyMetrics = async () => {
  try {
    await connectDB();

    // Xóa dữ liệu cũ
    await BodyMetrics.deleteMany({});
    console.log('Đã xóa dữ liệu body metrics cũ');

    // Tìm user admin
    let adminUser = await User.findOne({ email: 'admin@healthyfood.com' });
    
    if (!adminUser) {
      console.log('Tạo user admin...');
      const bcrypt = require('bcryptjs');
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('admin123', salt);
      
      adminUser = new User({
        fullName: 'Admin User',
        email: 'admin@healthyfood.com',
        password: hashedPassword,
        phone: '0123456789',
        gender: 'male',
        dateOfBirth: new Date('1990-01-01'),
        address: 'TP.HCM',
        role: 'admin'
      });
      
      await adminUser.save();
      console.log('Đã tạo user admin');
    }

    // Tạo dữ liệu body metrics mẫu cho admin (theo thời gian)
    const sampleData = [
      // 30 ngày trước
      {
        height: 170,
        weight: 75,
        age: 25,
        gender: 'male',
        activityLevel: 'moderate',
        notes: 'Bắt đầu chương trình giảm cân',
        createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
      },
      // 25 ngày trước
      {
        height: 170,
        weight: 74,
        age: 25,
        gender: 'male',
        activityLevel: 'moderate',
        notes: 'Giảm được 1kg sau 5 ngày',
        createdAt: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000)
      },
      // 20 ngày trước
      {
        height: 170,
        weight: 72.5,
        age: 25,
        gender: 'male',
        activityLevel: 'active',
        notes: 'Tăng cường tập luyện',
        createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000)
      },
      // 15 ngày trước
      {
        height: 170,
        weight: 71,
        age: 25,
        gender: 'male',
        activityLevel: 'active',
        notes: 'Kết quả tốt, tiếp tục duy trì',
        createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000)
      },
      // 10 ngày trước
      {
        height: 170,
        weight: 70,
        age: 25,
        gender: 'male',
        activityLevel: 'active',
        notes: 'Đạt mục tiêu giảm 5kg',
        createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000)
      },
      // 5 ngày trước
      {
        height: 170,
        weight: 69.5,
        age: 25,
        gender: 'male',
        activityLevel: 'moderate',
        notes: 'Giảm cường độ tập luyện để duy trì',
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
      },
      // Hôm nay
      {
        height: 170,
        weight: 69,
        age: 25,
        gender: 'male',
        activityLevel: 'moderate',
        notes: 'Duy trì cân nặng lý tưởng',
        createdAt: new Date()
      }
    ];

    // Tạo body metrics với tính toán
    for (const data of sampleData) {
      const metrics = calculateMetrics(
        data.height,
        data.weight,
        data.age,
        data.gender,
        data.activityLevel
      );

      const bodyMetrics = new BodyMetrics({
        user: adminUser._id,
        height: data.height,
        weight: data.weight,
        age: data.age,
        gender: data.gender,
        activityLevel: data.activityLevel,
        ...metrics,
        notes: data.notes,
        createdAt: data.createdAt
      });

      await bodyMetrics.save();
    }

    console.log('✅ Đã tạo thành công dữ liệu body metrics mẫu');
    console.log(`📊 Tổng cộng: ${sampleData.length} bản ghi`);
    console.log('👤 User: admin@healthyfood.com / admin123');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Lỗi khi tạo dữ liệu:', error);
    process.exit(1);
  }
};

// Chạy seeder
seedBodyMetrics(); 