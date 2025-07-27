import { useEffect, useState } from 'react';
import { mealSuggestionService } from '../services';

const MealDetailModal = ({ isOpen, onClose, mealId }) => {
  const [meal, setMeal] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen && mealId) {
      loadMealDetail();
    }
  }, [isOpen, mealId]);

  const loadMealDetail = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await mealSuggestionService.getMealSuggestionById(mealId);
      if (response.success) {
        setMeal(response.data);
      }
    } catch (error) {
      setError(error.message || 'Lỗi khi tải thông tin món ăn');
      console.error('Load meal detail error:', error);
    } finally {
      setLoading(false);
    }
  };

  const getMealTypeText = (type) => {
    switch (type) {
      case 'breakfast': return 'Bữa sáng';
      case 'lunch': return 'Bữa trưa';
      case 'dinner': return 'Bữa tối';
      case 'snack': return 'Ăn vặt';
      default: return type;
    }
  };

  const getDifficultyText = (difficulty) => {
    switch (difficulty) {
      case 'easy': return 'Dễ';
      case 'medium': return 'Trung bình';
      case 'hard': return 'Khó';
      default: return difficulty;
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'easy': return 'text-green-600 bg-green-50';
      case 'medium': return 'text-yellow-600 bg-yellow-50';
      case 'hard': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 w-10 h-10 bg-white bg-opacity-90 rounded-full flex items-center justify-center hover:bg-opacity-100 transition-all"
          >
            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {loading ? (
          <div className="p-8 text-center">
            <div className="text-gray-600">Đang tải thông tin món ăn...</div>
          </div>
        ) : error ? (
          <div className="p-8 text-center">
            <div className="text-red-600">{error}</div>
          </div>
        ) : meal ? (
          <div>
            {/* Image */}
            <div className="relative h-64 md:h-80">
              <img
                src={meal.image}
                alt={meal.title}
                className="w-full h-full object-cover rounded-t-2xl"
              />
              <div className="absolute bottom-4 left-4">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(meal.difficulty)}`}>
                  {getDifficultyText(meal.difficulty)}
                </span>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 md:p-8">
              {/* Title and basic info */}
              <div className="mb-6">
                <h2 className="text-3xl font-light text-[#4d544e] mb-2">{meal.title}</h2>
                <p className="text-gray-600 text-lg mb-4">{meal.description}</p>
                
                <div className="flex flex-wrap gap-4 text-sm">
                  <span className="px-3 py-1 bg-pink-50 text-pink-600 rounded-full">
                    {getMealTypeText(meal.mealType)}
                  </span>
                  {meal.prepTime && (
                    <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full">
                      {meal.prepTime} phút
                    </span>
                  )}
                  {meal.servings && (
                    <span className="px-3 py-1 bg-green-50 text-green-600 rounded-full">
                      {meal.servings} phần ăn
                    </span>
                  )}
                </div>
              </div>

              {/* Nutrition info */}
              <div className="mb-8">
                <h3 className="text-xl font-medium text-[#4d544e] mb-4">Thông Tin Dinh Dưỡng</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-pink-50 p-4 rounded-xl text-center">
                    <div className="text-2xl font-bold text-pink-600">{meal.calories}</div>
                    <div className="text-sm text-gray-600">Calories</div>
                  </div>
                  <div className="bg-blue-50 p-4 rounded-xl text-center">
                    <div className="text-2xl font-bold text-blue-600">{meal.protein}g</div>
                    <div className="text-sm text-gray-600">Protein</div>
                  </div>
                  <div className="bg-green-50 p-4 rounded-xl text-center">
                    <div className="text-2xl font-bold text-green-600">{meal.carbs}g</div>
                    <div className="text-sm text-gray-600">Carbs</div>
                  </div>
                  <div className="bg-yellow-50 p-4 rounded-xl text-center">
                    <div className="text-2xl font-bold text-yellow-600">{meal.fat}g</div>
                    <div className="text-sm text-gray-600">Chất béo</div>
                  </div>
                </div>
                {meal.fiber > 0 && (
                  <div className="mt-4 bg-purple-50 p-4 rounded-xl text-center inline-block">
                    <div className="text-2xl font-bold text-purple-600">{meal.fiber}g</div>
                    <div className="text-sm text-gray-600">Chất xơ</div>
                  </div>
                )}
              </div>

              {/* Tags */}
              {meal.tags && meal.tags.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-xl font-medium text-[#4d544e] mb-4">Đặc Điểm</h3>
                  <div className="flex flex-wrap gap-2">
                    {meal.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Suitable for goals */}
              {meal.suitableForGoals && meal.suitableForGoals.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-xl font-medium text-[#4d544e] mb-4">Phù Hợp Với Mục Tiêu</h3>
                  <div className="flex flex-wrap gap-2">
                    {meal.suitableForGoals.map((goal, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-[#4d544e] text-white rounded-full text-sm"
                      >
                        {goal === 'lose' ? 'Giảm cân' : goal === 'maintain' ? 'Duy trì' : 'Tăng cân'}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Ingredients */}
              {meal.ingredients && meal.ingredients.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-xl font-medium text-[#4d544e] mb-4">Nguyên Liệu</h3>
                  <div className="bg-gray-50 rounded-xl p-4">
                    <ul className="space-y-2">
                      {meal.ingredients.map((ingredient, index) => (
                        <li key={index} className="flex items-center">
                          <span className="w-2 h-2 bg-pink-500 rounded-full mr-3"></span>
                          <span className="font-medium">{ingredient.name}</span>
                          {ingredient.amount && ingredient.unit && (
                            <span className="ml-auto text-gray-600">
                              {ingredient.amount} {ingredient.unit}
                            </span>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {/* Instructions */}
              {meal.instructions && meal.instructions.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-xl font-medium text-[#4d544e] mb-4">Cách Làm</h3>
                  <div className="bg-gray-50 rounded-xl p-4">
                    <ol className="space-y-3">
                      {meal.instructions.map((step, index) => (
                        <li key={index} className="flex">
                          <span className="flex-shrink-0 w-6 h-6 bg-pink-500 text-white rounded-full flex items-center justify-center text-sm font-medium mr-3 mt-0.5">
                            {index + 1}
                          </span>
                          <span className="text-gray-700">{step}</span>
                        </li>
                      ))}
                    </ol>
                  </div>
                </div>
              )}

              {/* Stats */}
              <div className="border-t pt-6">
                <div className="grid grid-cols-2 gap-4 text-center text-sm text-gray-600">
                  <div>
                    <div className="text-lg font-medium text-[#4d544e]">{meal.views || 0}</div>
                    <div>Lượt xem</div>
                  </div>
                  <div>
                    <div className="text-lg font-medium text-[#4d544e]">{meal.likes || 0}</div>
                    <div>Lượt thích</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default MealDetailModal;