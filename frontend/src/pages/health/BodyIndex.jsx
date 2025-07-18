import { useState } from 'react';

const BodyIndex = () => {
  const [formData, setFormData] = useState({
    height: '',
    weight: '',
    age: '',
    gender: 'male',
    activityLevel: 'moderate'
  });

  const [results, setResults] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const calculateBMI = () => {
    const { height, weight, age, gender, activityLevel } = formData;
    
    if (!height || !weight || !age) {
      alert('Vui lòng nhập đầy đủ thông tin');
      return;
    }

    const heightInMeters = parseFloat(height) / 100;
    const weightInKg = parseFloat(weight);
    const bmi = weightInKg / (heightInMeters * heightInMeters);

    // Calculate BMR (Basal Metabolic Rate)
    let bmr;
    if (gender === 'male') {
      bmr = 88.362 + (13.397 * weightInKg) + (4.799 * parseFloat(height)) - (5.677 * parseFloat(age));
    } else {
      bmr = 447.593 + (9.247 * weightInKg) + (3.098 * parseFloat(height)) - (4.330 * parseFloat(age));
    }

    // Calculate daily calories based on activity level
    const activityMultipliers = {
      sedentary: 1.2,
      light: 1.375,
      moderate: 1.55,
      active: 1.725,
      veryActive: 1.9
    };

    const dailyCalories = bmr * activityMultipliers[activityLevel];

    // BMI categories
    let bmiCategory = '';
    let bmiColor = '';
    if (bmi < 18.5) {
      bmiCategory = 'Thiếu cân';
      bmiColor = 'text-blue-600';
    } else if (bmi < 25) {
      bmiCategory = 'Bình thường';
      bmiColor = 'text-green-600';
    } else if (bmi < 30) {
      bmiCategory = 'Thừa cân';
      bmiColor = 'text-yellow-600';
    } else {
      bmiCategory = 'Béo phì';
      bmiColor = 'text-red-600';
    }

    // Ideal weight range
    const idealWeightMin = 18.5 * (heightInMeters * heightInMeters);
    const idealWeightMax = 24.9 * (heightInMeters * heightInMeters);

    setResults({
      bmi: bmi.toFixed(1),
      bmiCategory,
      bmiColor,
      bmr: Math.round(bmr),
      dailyCalories: Math.round(dailyCalories),
      idealWeightMin: Math.round(idealWeightMin),
      idealWeightMax: Math.round(idealWeightMax)
    });
  };

  const resetForm = () => {
    setFormData({
      height: '',
      weight: '',
      age: '',
      gender: 'male',
      activityLevel: 'moderate'
    });
    setResults(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl font-extralight text-[#4d544e] mb-6">
              Chỉ Số Cơ Thể
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Tính toán BMI và các chỉ số sức khỏe để theo dõi tình trạng cơ thể
            </p>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent"></div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Calculator Form */}
          <div className="bg-white rounded-2xl p-8 shadow-sm">
            <h2 className="text-2xl font-light text-[#4d544e] mb-8">Nhập Thông Tin Cơ Thể</h2>
            
            <div className="space-y-6">
              {/* Height */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Chiều cao (cm)
                </label>
                <input
                  type="number"
                  name="height"
                  value={formData.height}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4d544e]/20 focus:border-[#4d544e] transition-colors"
                  placeholder="Ví dụ: 170"
                />
              </div>

              {/* Weight */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cân nặng (kg)
                </label>
                <input
                  type="number"
                  name="weight"
                  value={formData.weight}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4d544e]/20 focus:border-[#4d544e] transition-colors"
                  placeholder="Ví dụ: 65"
                />
              </div>

              {/* Age */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tuổi
                </label>
                <input
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4d544e]/20 focus:border-[#4d544e] transition-colors"
                  placeholder="Ví dụ: 25"
                />
              </div>

              {/* Gender */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Giới tính
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, gender: 'male' }))}
                    className={`px-4 py-3 rounded-xl border transition-all ${
                      formData.gender === 'male'
                        ? 'bg-[#4d544e] text-white border-[#4d544e]'
                        : 'bg-white text-gray-700 border-gray-200 hover:border-[#4d544e]'
                    }`}
                  >
                    Nam
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, gender: 'female' }))}
                    className={`px-4 py-3 rounded-xl border transition-all ${
                      formData.gender === 'female'
                        ? 'bg-[#4d544e] text-white border-[#4d544e]'
                        : 'bg-white text-gray-700 border-gray-200 hover:border-[#4d544e]'
                    }`}
                  >
                    Nữ
                  </button>
                </div>
              </div>

              {/* Activity Level */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mức độ hoạt động
                </label>
                <select
                  name="activityLevel"
                  value={formData.activityLevel}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4d544e]/20 focus:border-[#4d544e] transition-colors"
                >
                  <option value="sedentary">Ít vận động</option>
                  <option value="light">Vận động nhẹ</option>
                  <option value="moderate">Vận động vừa</option>
                  <option value="active">Vận động nhiều</option>
                  <option value="veryActive">Vận động rất nhiều</option>
                </select>
              </div>

              {/* Buttons */}
              <div className="flex gap-4 pt-4">
                <button
                  onClick={calculateBMI}
                  className="flex-1 bg-[#4d544e] text-white py-3 px-6 rounded-xl hover:bg-[#3a403a] transition-colors font-medium"
                >
                  Tính Toán
                </button>
                <button
                  onClick={resetForm}
                  className="flex-1 bg-gray-100 text-gray-700 py-3 px-6 rounded-xl hover:bg-gray-200 transition-colors font-medium"
                >
                  Đặt Lại
                </button>
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="space-y-6">
            {results ? (
              <>
                {/* BMI Result */}
                <div className="bg-white rounded-2xl p-8 shadow-sm">
                  <h3 className="text-xl font-light text-[#4d544e] mb-6">Kết Quả BMI</h3>
                  <div className="text-center mb-6">
                    <div className="text-5xl font-light text-[#4d544e] mb-2">
                      {results.bmi}
                    </div>
                    <div className={`text-lg font-medium ${results.bmiColor}`}>
                      {results.bmiCategory}
                    </div>
                  </div>
                  
                  {/* BMI Scale */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>Thiếu cân</span>
                      <span>Bình thường</span>
                      <span>Thừa cân</span>
                      <span>Béo phì</span>
                    </div>
                    <div className="h-2 bg-gradient-to-r from-blue-400 via-green-400 via-yellow-400 to-red-400 rounded-full"></div>
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>18.5</span>
                      <span>25</span>
                      <span>30</span>
                    </div>
                  </div>
                </div>

                {/* Health Metrics */}
                <div className="bg-white rounded-2xl p-8 shadow-sm">
                  <h3 className="text-xl font-light text-[#4d544e] mb-6">Chỉ Số Sức Khỏe</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="text-center p-4 bg-gray-50 rounded-xl">
                      <div className="text-2xl font-light text-[#4d544e] mb-1">
                        {results.bmr}
                      </div>
                      <div className="text-sm text-gray-600">BMR (kcal/ngày)</div>
                    </div>
                    <div className="text-center p-4 bg-gray-50 rounded-xl">
                      <div className="text-2xl font-light text-[#4d544e] mb-1">
                        {results.dailyCalories}
                      </div>
                      <div className="text-sm text-gray-600">Calo hàng ngày</div>
                    </div>
                  </div>
                </div>

                {/* Ideal Weight */}
                <div className="bg-white rounded-2xl p-8 shadow-sm">
                  <h3 className="text-xl font-light text-[#4d544e] mb-6">Cân Nặng Lý Tưởng</h3>
                  <div className="text-center">
                    <div className="text-2xl font-light text-[#4d544e] mb-2">
                      {results.idealWeightMin} - {results.idealWeightMax} kg
                    </div>
                    <div className="text-sm text-gray-600">
                      Dựa trên chỉ số BMI từ 18.5 - 24.9
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="bg-white rounded-2xl p-8 shadow-sm">
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">📊</div>
                  <h3 className="text-xl font-light text-[#4d544e] mb-2">
                    Chưa có kết quả
                  </h3>
                  <p className="text-gray-600">
                    Vui lòng nhập thông tin và nhấn "Tính Toán" để xem kết quả
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* BMI Information */}
        <div className="mt-16 bg-white rounded-2xl p-8 shadow-sm">
          <h3 className="text-2xl font-light text-[#4d544e] mb-6">Thông Tin Về BMI</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center p-4 border border-blue-200 rounded-xl">
              <div className="text-blue-600 font-medium mb-2">Thiếu cân</div>
              <div className="text-sm text-gray-600">BMI &lt; 18.5</div>
              <div className="text-xs text-gray-500 mt-2">Cần tăng cân</div>
            </div>
            <div className="text-center p-4 border border-green-200 rounded-xl">
              <div className="text-green-600 font-medium mb-2">Bình thường</div>
              <div className="text-sm text-gray-600">BMI 18.5 - 24.9</div>
              <div className="text-xs text-gray-500 mt-2">Cân nặng lý tưởng</div>
            </div>
            <div className="text-center p-4 border border-yellow-200 rounded-xl">
              <div className="text-yellow-600 font-medium mb-2">Thừa cân</div>
              <div className="text-sm text-gray-600">BMI 25 - 29.9</div>
              <div className="text-xs text-gray-500 mt-2">Cần giảm cân</div>
            </div>
            <div className="text-center p-4 border border-red-200 rounded-xl">
              <div className="text-red-600 font-medium mb-2">Béo phì</div>
              <div className="text-sm text-gray-600">BMI ≥ 30</div>
              <div className="text-xs text-gray-500 mt-2">Cần giảm cân nhiều</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BodyIndex; 