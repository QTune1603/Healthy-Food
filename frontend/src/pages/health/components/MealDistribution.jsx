//Phân bổ theo bữa ăn
import React from 'react';

const MealDistribution = ({ consumedFoods, totalCalories }) => {
  const mealNames = {
    breakfast: 'Sáng',
    lunch: 'Trưa',
    dinner: 'Tối',
    snack: 'Snack'
  };

  const mealTypes = ['breakfast', 'lunch', 'dinner', 'snack'];

  return (
    <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
      <h3 className="text-lg font-medium text-gray-800 mb-4">Phân bổ theo bữa ăn</h3>

      {mealTypes.map(mealType => {
        const mealEntries = consumedFoods.filter(entry => entry.mealType === mealType);
        const mealCalories = mealEntries.reduce((sum, entry) => sum + (entry.calories || 0), 0);
        const percentage = totalCalories > 0 ? (mealCalories / totalCalories) * 100 : 0;

        return (
          <div key={mealType} className="mb-3">
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-600">{mealNames[mealType]}</span>
              <span className="font-medium">
                {Math.round(mealCalories)} kcal ({Math.round(percentage)}%)
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-green-400 to-blue-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${percentage}%` }}
              ></div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default React.memo(MealDistribution);
