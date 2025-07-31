//Thống kê ngày
import React from 'react';

const DailySummary = ({
  selectedDate,
  totalCalories,
  totalProtein,
  totalCarbs,
  totalFat,
  calorieTarget
}) => {
  return (
    <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
      <h3 className="text-lg font-medium text-gray-800 mb-4">
        Thống kê ngày {selectedDate.getDate()}/{selectedDate.getMonth() + 1}
      </h3>

      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Tổng Calo</span>
          <span className="text-lg font-bold text-[#3C493F]">
            {Math.round(totalCalories)}
            {calorieTarget && (
              <span className="text-sm text-gray-500">/{calorieTarget.targetCalories}</span>
            )}
          </span>
        </div>

        {calorieTarget && (
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-[#3C493F] h-2 rounded-full transition-all duration-300"
              style={{
                width: `${Math.min(100, (totalCalories / calorieTarget.targetCalories) * 100)}%`
              }}
            ></div>
          </div>
        )}

        <div className="pt-2 border-t border-gray-100">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Protein:</span>
            <span className="font-medium">{Math.round(totalProtein * 10) / 10}g</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Carbs:</span>
            <span className="font-medium">{Math.round(totalCarbs * 10) / 10}g</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Fat:</span>
            <span className="font-medium">{Math.round(totalFat * 10) / 10}g</span>
          </div>
        </div>

        {calorieTarget && (
          <div className="pt-2 border-t border-gray-100">
            <div className="text-xs text-gray-500">
              <div>Mục tiêu: {calorieTarget.goalDescription}</div>
              <div>BMI: {calorieTarget.bmi}</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default React.memo(DailySummary);
