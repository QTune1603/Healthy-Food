import React, { memo } from 'react';
import { mealSuggestionService } from '../../../../services';

const CaloriesMealSuggestions = memo(({ loadingMeals, mealSuggestions, targetCalories, handleMealClick, mealCache }) => {
  
  const preloadMealDetail = async (mealId) => {
    if (mealCache.current[mealId]) return; // Đã cache thì bỏ qua
    
    try {
      const response = await mealSuggestionService.getMealSuggestionById(mealId); // đúng API đã dùng
      if (response.success) {
        mealCache.current[mealId] = response.data;
      }
    } catch (error) {
      console.error('Error preloading meal detail:', error);
    }
  };

  return (
    <div className="mt-16 bg-white rounded-2xl p-8 shadow-sm">
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-2xl font-light text-[#4d544e]">Gợi Ý Món Ăn</h3>
        {targetCalories > 0 && (
          <div className="text-sm text-gray-600">
            Phù hợp với {targetCalories} kcal/ngày
          </div>
        )}
      </div>
      
      {loadingMeals ? (
        <div className="text-center py-8">
          <div className="text-gray-600">Đang tải gợi ý món ăn...</div>
        </div>
      ) : mealSuggestions.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mealSuggestions.map((meal) => (
            <div 
              key={meal._id} 
              className="group cursor-pointer hover:shadow-lg transition-all duration-300 bg-white rounded-lg p-4"
              onMouseEnter={() => preloadMealDetail(meal._id)} // preload khi hover
              onClick={() => handleMealClick(meal._id)}
            >
              <div className="aspect-w-16 aspect-h-9 mb-4 overflow-hidden rounded-lg">
                <img
                  src={meal.image}
                  alt={meal.title}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
              </div>
              <h4 className="font-medium text-[#4d544e] mb-1 group-hover:text-pink-500 transition-colors">
                {meal.title}
              </h4>
              <p className="text-sm text-gray-600 mb-2 line-clamp-2">{meal.description}</p>
              <div className="flex justify-between items-center text-sm mb-2">
                <span className="text-pink-500 font-medium">{meal.calories} Calo</span>
                <div className="flex gap-2">
                  {meal.tags?.slice(0, 2).map((tag, index) => (
                    <span key={index} className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex justify-between items-center">
                {meal.mealType && (
                  <span className="text-xs text-gray-500 capitalize">
                    {meal.mealType === 'breakfast' ? 'Sáng' : 
                     meal.mealType === 'lunch' ? 'Trưa' : 
                     meal.mealType === 'dinner' ? 'Tối' : 'Ăn vặt'}
                  </span>
                )}
                <span className="text-xs text-pink-500 group-hover:text-pink-600 transition-colors">
                  Xem chi tiết →
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <div className="text-gray-600">Không có gợi ý món ăn</div>
        </div>
      )}
    </div>
  );
});

export default CaloriesMealSuggestions;
