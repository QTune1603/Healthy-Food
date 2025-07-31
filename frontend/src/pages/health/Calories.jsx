import React, { useEffect, useState, useCallback, useMemo, useRef } from 'react';
import { calorieService, mealSuggestionService } from '../../services';

const CaloriesForm = React.lazy(() => import('./components/Calories/CaloriesForm'));
const CaloriesResults = React.lazy(() => import('./components/Calories/CaloriesResults'));
const CaloriesMealSuggestions = React.lazy(() => import('./components/Calories/CaloriesMealSuggestions'));
const MealDetailModal = React.lazy(() => import('../../components/MealDetailModal'));

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

  // Modal state
  const [selectedMealId, setSelectedMealId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const mealCache = useRef({});

  // Memoized values from results
  const bmiCategory = useMemo(() => results?.bmiCategory || '', [results]);
  const targetCalories = useMemo(() => results?.targetCalories || 0, [results]);

  //Load meal suggestions
  const loadMealSuggestionsByCalories = useCallback(async (targetCalories) => {
    try {
      setLoadingMeals(true);
      const response = await mealSuggestionService.getMealSuggestionsByCalories(targetCalories, 'all', 6);
      if (response.success) {
        setMealSuggestions(response.data.meals || response.data);
      }
    } catch (error) {
      console.error('Load meal suggestions by calories error:', error);
    } finally {
      setLoadingMeals(false);
    }
  }, []);

  const loadMealSuggestions = useCallback(async () => {
    try {
      setLoadingMeals(true);
      const response = await mealSuggestionService.getPopularMealSuggestions(6);
      if (response.success) {
        setMealSuggestions(response.data);
      }
    } catch (error) {
      console.error('Load meal suggestions error:', error);
    } finally {
      setLoadingMeals(false);
    }
  }, []);

  //Load latest calculation (cache + API)
  const loadLatestCalculation = useCallback(async () => {
    try {
      // Load từ cache trước
      const cachedData = localStorage.getItem('latestCalories');
      if (cachedData) {
        const parsed = JSON.parse(cachedData);
        setResults(parsed.data);

        if (parsed.data.height && parsed.data.weight && parsed.data.age) {
          setFormData({
            height: parsed.data.height.toString(),
            weight: parsed.data.weight.toString(),
            age: parsed.data.age.toString(),
            gender: parsed.data.gender || 'male',
            activityLevel: parsed.data.activityLevel || 'moderate',
            goal: parsed.data.goal || 'maintain'
          });
        }

        if (parsed.data.targetCalories) {
          loadMealSuggestionsByCalories(parsed.data.targetCalories);
        }
      }

      // Fetch API để cập nhật mới nhất
      const response = await calorieService.getLatestCalculation();
      if (response.success && response.data) {
        setResults(response.data);
        localStorage.setItem('latestCalories', JSON.stringify({
          data: response.data,
          updatedAt: Date.now()
        }));

        if (response.data.targetCalories) {
          loadMealSuggestionsByCalories(response.data.targetCalories);
        }
      } else {
        loadMealSuggestions();
      }
    } catch (error) {
      console.error('Load latest calculation error:', error);
      loadMealSuggestions();
    }
  }, [loadMealSuggestionsByCalories, loadMealSuggestions]);

  //Form handlers
  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  }, []);

  const calculateCalories = useCallback(async () => {
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

      const response = await calorieService.calculateCalories(calculationData);

      if (response.success) {
        setResults(response.data);
        localStorage.setItem('latestCalories', JSON.stringify({
          data: response.data,
          updatedAt: Date.now()
        }));

        if (response.data.targetCalories) {
          loadMealSuggestionsByCalories(response.data.targetCalories);
        }
      } else {
        setError(response.message || 'Có lỗi xảy ra khi tính toán');
      }
    } catch (error) {
      setError(error.message || 'Có lỗi xảy ra khi tính toán');
    } finally {
      setLoading(false);
    }
  }, [formData, loadMealSuggestionsByCalories]);

  const resetForm = useCallback(() => {
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
    loadMealSuggestions();
  }, [loadMealSuggestions]);

  //Helpers
  const getBMICategoryText = useCallback((category) => {
    switch (category) {
      case 'underweight': return 'Thiếu cân';
      case 'normal': return 'Bình thường';
      case 'overweight': return 'Thừa cân';
      case 'obese': return 'Béo phì';
      default: return category;
    }
  }, []);

  const getBMICategoryColor = useCallback((category) => {
    switch (category) {
      case 'underweight': return 'text-blue-600 bg-blue-50';
      case 'normal': return 'text-green-600 bg-green-50';
      case 'overweight': return 'text-yellow-600 bg-yellow-50';
      case 'obese': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  }, []);

  const formatDate = useCallback((dateString) => {
    return new Date(dateString).toLocaleDateString('vi-VN');
  }, []);

  //Modal handlers
  const handleMealClick = useCallback((mealId) => {
    setSelectedMealId(mealId);
    setIsModalOpen(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    setSelectedMealId(null);
  }, []);

  //Init
  useEffect(() => {
    loadLatestCalculation();
  }, [loadLatestCalculation]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-extralight text-[#4d544e] mb-6">
            Lượng Calo Cơ Thể Cần Trong Ngày
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Tính toán lượng calo cần thiết dựa trên mục tiêu và lối sống của bạn
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <React.Suspense fallback={<div>Loading...</div>}>
          <CaloriesForm
            formData={formData}
            error={error}
            loading={loading}
            handleInputChange={handleInputChange}
            calculateCalories={calculateCalories}
            resetForm={resetForm}
          />
          <CaloriesResults
            results={results}
            targetCalories={targetCalories}
            bmiCategory={bmiCategory}
            getBMICategoryText={getBMICategoryText}
            getBMICategoryColor={getBMICategoryColor}
            formatDate={formatDate}
          />
        </React.Suspense>

        <React.Suspense fallback={<div>Loading meal suggestions...</div>}>
          <CaloriesMealSuggestions
            loadingMeals={loadingMeals}
            mealSuggestions={mealSuggestions}
            targetCalories={targetCalories}
            handleMealClick={handleMealClick}
            mealCache={mealCache}
          />
        </React.Suspense>
      </div>

      <React.Suspense fallback={<div>Loading...</div>}>
        <MealDetailModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          mealId={selectedMealId}
          mealCache={mealCache}
        />
      </React.Suspense>
    </div>
  );
};

export default Calories;
