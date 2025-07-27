import { useEffect, useState } from 'react';
import MealDetailModal from '../../components/MealDetailModal';
import { calorieService, mealSuggestionService } from '../../services';

const Calories = () => {
  const [formData, setFormData] = useState({
    height: '',
    weight: '',
    age: '',
    gender: 'male',
    activityLevel: 'moderate',
    goal: 'maintain'
  });

  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [mealSuggestions, setMealSuggestions] = useState([]);
  const [loadingMeals, setLoadingMeals] = useState(false);
  const [calculationHistory, setCalculationHistory] = useState([]);
  
  // Modal state
  const [selectedMealId, setSelectedMealId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Load latest calculation and meal suggestions on component mount
  useEffect(() => {
    loadLatestCalculation();
    // loadMealSuggestions(); - Removed: now handled in loadLatestCalculation
  }, []);

  // Load meal suggestions when results change - REMOVED TO AVOID CONFLICT
  // useEffect(() => {
  //   if (results?.targetCalories) {
  //     loadMealSuggestionsByCalories(results.targetCalories);
  //   }
  // }, [results]);

  const loadLatestCalculation = async () => {
    try {
      const response = await calorieService.getLatestCalculation();
      if (response.success && response.data) {
        setResults(response.data);
        
        // Fill form with latest data if available
        if (response.data.height && response.data.weight && response.data.age) {
          setFormData({
            height: response.data.height.toString(),
            weight: response.data.weight.toString(),
            age: response.data.age.toString(),
            gender: response.data.gender || 'male',
            activityLevel: response.data.activityLevel || 'moderate',
            goal: response.data.goal || 'maintain'
          });
        }
        
        // Load meal suggestions for the latest calculation
        if (response.data.targetCalories) {
          loadMealSuggestionsByCalories(response.data.targetCalories);
        }
      } else {
        // If no latest calculation, load popular meals
        loadMealSuggestions();
      }
    } catch (error) {
      console.error('Load latest calculation error:', error);
      // Fallback to popular meals if error
      loadMealSuggestions();
    }
  };

  const loadMealSuggestions = async () => {
    try {
      setLoadingMeals(true);
      const response = await mealSuggestionService.getPopularMealSuggestions(6);
      console.log('Popular meal suggestions response:', response);
      if (response.success) {
        setMealSuggestions(response.data);
      }
    } catch (error) {
      console.error('Load meal suggestions error:', error);
    } finally {
      setLoadingMeals(false);
    }
  };

  const loadMealSuggestionsByCalories = async (targetCalories) => {
    try {
      setLoadingMeals(true);
      const response = await mealSuggestionService.getMealSuggestionsByCalories(targetCalories, 'all', 6);
      console.log('Meal suggestions by calories response:', response);
      if (response.success) {
        setMealSuggestions(response.data.meals || response.data);
      }
    } catch (error) {
      console.error('Load meal suggestions by calories error:', error);
    } finally {
      setLoadingMeals(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const calculateCalories = async () => {
    const { height, weight, age, gender, activityLevel, goal } = formData;
    
    if (!height || !weight || !age) {
      setError('Vui lòng nhập đầy đủ thông tin');
      return;
    }

    try {
      setLoading(true);
      setError('');
      
      const calculationData = {
        height: parseFloat(height),
        weight: parseFloat(weight),
        age: parseFloat(age),
        gender,
        activityLevel,
        goal
      };

      console.log('Sending calculation data:', calculationData);
      const response = await calorieService.calculateCalories(calculationData);
      console.log('Received response:', response);
      
      if (response.success) {
        setResults(response.data);
        setError('');
        
        // Load meal suggestions based on new calorie target
        if (response.data.targetCalories) {
          loadMealSuggestionsByCalories(response.data.targetCalories);
        }
      } else {
        setError(response.message || 'Có lỗi xảy ra khi tính toán');
      }
    } catch (error) {
      setError(error.message || 'Có lỗi xảy ra khi tính toán');
      console.error('Calculate calories error:', error);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      height: '',
      weight: '',
      age: '',
      gender: 'male',
      activityLevel: 'moderate',
      goal: 'maintain'
    });
    setResults(null);
    setError('');
    
    // Load popular meal suggestions when form is reset
    loadMealSuggestions();
  };

  const getBMICategoryText = (category) => {
    switch (category) {
      case 'underweight':
        return 'Thiếu cân';
      case 'normal':
        return 'Bình thường';
      case 'overweight':
        return 'Thừa cân';
      case 'obese':
        return 'Béo phì';
      default:
        return category;
    }
  };

  const getBMICategoryColor = (category) => {
    switch (category) {
      case 'underweight':
        return 'text-blue-600 bg-blue-50';
      case 'normal':
        return 'text-green-600 bg-green-50';
      case 'overweight':
        return 'text-yellow-600 bg-yellow-50';
      case 'obese':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  const handleMealClick = (mealId) => {
    setSelectedMealId(mealId);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedMealId(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl font-extralight text-[#4d544e] mb-6">
              Lượng Calo Cơ Thể Cần Trong Ngày
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Tính toán lượng calo cần thiết dựa trên mục tiêu và lối sống của bạn
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
            <div className="flex items-center mb-8">
              <div className="w-12 h-12 rounded-full bg-pink-500 flex items-center justify-center mr-4">
                <span className="text-white text-xl font-bold">H</span>
              </div>
              <h2 className="text-2xl font-light text-[#4d544e]">Tính Toán Calo</h2>
            </div>
            
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}
            
            <div className="space-y-6">
              {/* Height */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Chiều cao
                </label>
                <div className="relative">
                  <input
                    type="number"
                    name="height"
                    value={formData.height}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4d544e]/20 focus:border-[#4d544e] transition-colors"
                    placeholder="170"
                    min="50"
                    max="300"
                  />
                  <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500">cm</span>
                </div>
              </div>

              {/* Weight */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cân nặng
                </label>
                <div className="relative">
                  <input
                    type="number"
                    name="weight"
                    value={formData.weight}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4d544e]/20 focus:border-[#4d544e] transition-colors"
                    placeholder="65"
                    min="20"
                    max="500"
                  />
                  <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500">kg</span>
                </div>
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
                  placeholder="25"
                  min="1"
                  max="120"
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
                  <option value="sedentary">Ít vận động (ngồi nhiều)</option>
                  <option value="light">Vận động nhẹ (1-3 ngày/tuần)</option>
                  <option value="moderate">Vận động vừa (3-5 ngày/tuần)</option>
                  <option value="active">Vận động nhiều (6-7 ngày/tuần)</option>
                  <option value="veryActive">Vận động rất nhiều (2 lần/ngày)</option>
                </select>
              </div>

              {/* Goal */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mục tiêu
                </label>
                <select
                  name="goal"
                  value={formData.goal}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4d544e]/20 focus:border-[#4d544e] transition-colors"
                >
                  <option value="lose">Giảm cân</option>
                  <option value="maintain">Duy trì cân nặng</option>
                  <option value="gain">Tăng cân</option>
                </select>
              </div>

              {/* Buttons */}
              <div className="flex gap-4 pt-4">
                <button
                  onClick={calculateCalories}
                  disabled={loading}
                  className="flex-1 bg-pink-500 text-white py-3 px-6 rounded-xl hover:bg-pink-600 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Đang tính...' : 'Tính Toán'}
                </button>
                <button
                  onClick={resetForm}
                  disabled={loading}
                  className="flex-1 bg-gray-100 text-gray-700 py-3 px-6 rounded-xl hover:bg-gray-200 transition-colors font-medium disabled:opacity-50"
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
                      {results.targetCalories}
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
                          <span className={`ml-2 px-2 py-1 rounded-full text-xs ${getBMICategoryColor(results.bmiCategory)}`}>
                            {getBMICategoryText(results.bmiCategory)}
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
            ) : (
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
            )}
          </div>
        </div>

        {/* Meal Suggestions */}
        <div className="mt-16 bg-white rounded-2xl p-8 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-2xl font-light text-[#4d544e]">Gợi Ý Món Ăn</h3>
            {results?.targetCalories && (
              <div className="text-sm text-gray-600">
                Phù hợp với {results.targetCalories} kcal/ngày
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
                  onClick={() => handleMealClick(meal._id)}
                >
                  <div className="aspect-w-16 aspect-h-9 mb-4 overflow-hidden rounded-lg">
                    <img
                      src={meal.image}
                      alt={meal.title}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
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
      </div>

      {/* Meal Detail Modal */}
      <MealDetailModal 
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        mealId={selectedMealId}
      />
    </div>
  );
};

export default Calories; 