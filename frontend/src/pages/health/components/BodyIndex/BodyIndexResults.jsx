import React, { memo } from 'react';

const BodyIndexResults = memo(({ results }) => {
  if (!results) {
    return (
      <div className="bg-white rounded-2xl p-8 shadow-sm">
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📊</div>
          <h3 className="text-xl font-light text-[#4d544e] mb-2">Chưa có kết quả</h3>
          <p className="text-gray-600">Vui lòng nhập thông tin và nhấn "Tính Toán" để xem kết quả</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl p-8 shadow-sm">
        <h3 className="text-xl font-light text-[#4d544e] mb-6">Kết Quả BMI</h3>
        <div className="text-center mb-6">
          <div className="text-5xl font-light text-[#4d544e] mb-2">{results.bmi}</div>
          <div className={`text-lg font-medium ${results.bmiColor}`}>{results.bmiCategory}</div>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-8 shadow-sm">
        <h3 className="text-xl font-light text-[#4d544e] mb-6">Chỉ Số Sức Khỏe</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="text-center p-4 bg-gray-50 rounded-xl">
            <div className="text-2xl font-light">{results.bmr}</div>
            <div className="text-sm text-gray-600">BMR (kcal/ngày)</div>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-xl">
            <div className="text-2xl font-light">{results.dailyCalories}</div>
            <div className="text-sm text-gray-600">Calo hàng ngày</div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-8 shadow-sm">
        <h3 className="text-xl font-light text-[#4d544e] mb-6">Cân Nặng Lý Tưởng</h3>
        <div className="text-center">
          <div className="text-2xl font-light">{results.idealWeightMin} - {results.idealWeightMax} kg</div>
          <div className="text-sm text-gray-600">Dựa trên chỉ số BMI từ 18.5 - 24.9</div>
        </div>
      </div>
    </div>
  );
});

export default BodyIndexResults;
