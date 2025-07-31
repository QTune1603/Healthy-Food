import React, { Suspense, useEffect, useState } from 'react';

const BodyIndexForm = React.lazy(() => import('./components/BodyIndex/BodyIndexForm'));
const BodyIndexResults = React.lazy(() => import('./components/BodyIndex/BodyIndexResults'));
const BodyIndexInfo = React.lazy(() => import('./components/BodyIndex/BodyIndexInfo'));

const STORAGE_KEY = 'bodyIndexData';

const BodyIndex = () => {
  const [formData, setFormData] = useState({ 
    height: '', 
    weight: '', 
    age: '', 
    gender: 'male', 
    activityLevel: 'moderate' 
  });

  const [results, setResults] = useState(null);


  useEffect(() => {
    const savedData = localStorage.getItem(STORAGE_KEY);
    if (savedData) {
      const parsed = JSON.parse(savedData);
      setFormData(parsed.formData || formData);
      setResults(parsed.results || null);
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const calculateBMI = () => {
    const { height, weight, age, gender, activityLevel } = formData;
    if (!height || !weight || !age) return alert('Vui lòng nhập đầy đủ thông tin');

    const heightInMeters = parseFloat(height) / 100;
    const bmi = parseFloat(weight) / (heightInMeters * heightInMeters);
    const bmr = gender === 'male'
      ? 88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * age)
      : 447.593 + (9.247 * weight) + (3.098 * height) - (4.330 * age);
    const dailyCalories = bmr * { sedentary: 1.2, light: 1.375, moderate: 1.55, active: 1.725, veryActive: 1.9 }[activityLevel];
    const category = 
      bmi < 18.5 ? 'Thiếu cân' : bmi < 25 ? 'Bình thường' : bmi < 30 ? 'Thừa cân' : 'Béo phì';
    const color = 
      bmi < 18.5 ? 'text-blue-600' : bmi < 25 ? 'text-green-600' : bmi < 30 ? 'text-yellow-600' : 'text-red-600';

    const newResults = {
      bmi: bmi.toFixed(1),
      bmiCategory: category,
      bmiColor: color,
      bmr: Math.round(bmr),
      dailyCalories: Math.round(dailyCalories),
      idealWeightMin: Math.round(18.5 * heightInMeters * heightInMeters),
      idealWeightMax: Math.round(24.9 * heightInMeters * heightInMeters)
    };

    setResults(newResults);

    // Lưu vào localStorage
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ formData, results: newResults }));
  };

  const resetForm = () => {
    const resetData = {
      height: '',
      weight: '',
      age: '',
      gender: 'male',
      activityLevel: 'moderate'
    };
    setFormData(resetData);
    setResults(null);

    // Xóa cache
    localStorage.removeItem(STORAGE_KEY);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="relative py-20 bg-white">
        <div className="text-center">
          <h1 className="text-5xl font-extralight text-[#4d544e] mb-6">Chỉ Số Cơ Thể</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">Tính toán BMI và các chỉ số sức khỏe để theo dõi tình trạng cơ thể</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <Suspense fallback={<div>Đang tải form...</div>}>
            <BodyIndexForm 
              formData={formData} 
              handleInputChange={handleInputChange} 
              calculateBMI={calculateBMI} 
              resetForm={resetForm} />
          </Suspense>

          <Suspense fallback={<div>Đang tải kết quả...</div>}>
            <BodyIndexResults results={results} />
          </Suspense>
        </div>

        <Suspense fallback={<div>Đang tải thông tin...</div>}>
          <BodyIndexInfo />
        </Suspense>
      </div>
    </div>
  );
};

export default BodyIndex;
