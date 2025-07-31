import React, { memo } from 'react';

const CaloriesResults = memo(({ results, targetCalories, bmiCategory, getBMICategoryText, getBMICategoryColor, formatDate }) => {
  if (!results) {
    return (
      <div className="bg-white rounded-2xl p-8 shadow-sm">
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🍽️</div>
          <h3 className="text-xl font-light text-[#4d544e] mb-2">
            Chưa có kết quả
          </h3>
          <p className="text-gray-600">
            Vui lòng nhập thông tin và nhấn "Tính Toán"
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Main Result */}
      <div className="bg-white rounded-2xl p-8 shadow-sm">
        <div className="flex items-center mb-6">
          <div className="w-12 h-12 rounded-full bg-pink-500 flex items-center justify-center mr-4">
            <span className="text-white text-xl font-bold">H</span>
          </div>
          <h3 className="text-xl font-light text-[#4d544e]">Kết Quả Tính Toán</h3>
        </div>
        
        <div className="text-center mb-6">
          <div className="text-4xl font-light text-[#4d544e] mb-2">
            {targetCalories}
          </div>
          <div className="text-lg text-gray-600 mb-1">kcal/ngày</div>
          <div className="text-sm text-gray-500">{results.goalDescription}</div>
        </div>

        <div className="grid grid-cols-3 gap-4 text-center mb-6">
          <div className="p-3 bg-blue-50 rounded-lg">
            <div className="text-lg font-medium text-blue-600">{results.protein}g</div>
            <div className="text-xs text-gray-600">Protein</div>
          </div>
          <div className="p-3 bg-green-50 rounded-lg">
            <div className="text-lg font-medium text-green-600">{results.carbs}g</div>
            <div className="text-xs text-gray-600">Carbs</div>
          </div>
          <div className="p-3 bg-yellow-50 rounded-lg">
            <div className="text-lg font-medium text-yellow-600">{results.fats}g</div>
            <div className="text-xs text-gray-600">Chất béo</div>
          </div>
        </div>

        {/* BMI Info */}
        {results.bmi && (
          <div className="border-t pt-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">BMI</span>
              <div className="text-right">
                <span className="font-medium text-[#4d544e]">{results.bmi}</span>
                <span className={`ml-2 px-2 py-1 rounded-full text-xs ${getBMICategoryColor(bmiCategory)}`}>
                  {getBMICategoryText(bmiCategory)}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Additional Info */}
      <div className="bg-gray-100 rounded-2xl p-6">
        <h4 className="text-lg font-medium text-[#4d544e] mb-4">Thông Tin Thêm</h4>
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-600">BMR (Trao đổi chất cơ bản)</span>
            <span className="font-medium text-[#4d544e]">{results.bmr} kcal</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Calo duy trì cân nặng</span>
            <span className="font-medium text-[#4d544e]">{results.maintenanceCalories} kcal</span>
          </div>
          {results.createdAt && (
            <div className="flex justify-between">
              <span className="text-gray-600">Ngày tính toán</span>
              <span className="font-medium text-[#4d544e]">{formatDate(results.createdAt)}</span>
            </div>
          )}
        </div>
      </div>
    </>
  );
});

export default CaloriesResults;
