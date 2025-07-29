import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { foodService, foodDiaryService, calorieService } from '../../services';
import FoodList from './components/FoodList'; 
import DailySummary from './components/DailySummary';
import MealDistribution from './components/MealDistribution';
import ConsumedFoodsTable from './components/ConsumedFoodsTable';
import { Suspense } from 'react';


const AddFoodModal = React.lazy(() => import('./components/AddFoodModal'));

const Calculator = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  
  // State cho thực phẩm
  const [foods, setFoods] = useState([]);
  const [foodGroups, setFoodGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  
  // State cho nhật ký tiêu thụ
  const [consumedFoods, setConsumedFoods] = useState([]);
  const [editingEntry, setEditingEntry] = useState(null);
  
  // State cho tính toán calo
  const [calorieTarget, setCalorieTarget] = useState(null);
  
  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedFood, setSelectedFood] = useState(null);
  const [quantity, setQuantity] = useState(100);
  const [selectedMealType, setSelectedMealType] = useState('breakfast');
  
  // Loading states
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);


  // Load danh sách thực phẩm
  const loadFoods = useCallback(async () => {
    try {
      setLoading(true);
      const response = await foodService.getAllFoods({ limit: 1000 });
      const foodData = response.data?.foods || [];
      setFoods(foodData);
      
      // Tạo danh sách nhóm thực phẩm
      const groups = [...new Set(foodData.map(food => food.category).filter(Boolean))];
      setFoodGroups(groups);
    } catch (error) {
      console.error('Load foods error:', error);
      setError('Không thể tải danh sách thực phẩm');
    } finally {
      setLoading(false);
    }
  }, []);

  // Load mục tiêu calo
  const loadCalorieTarget = useCallback(async () => {
    try {
      const response = await calorieService.getLatestCalculation();
      if (response.success) {
        setCalorieTarget(response.data);
      }
    } catch (error) {
      console.error('Load calorie target error:', error);
    }
  }, []);

  // Load thực phẩm đã tiêu thụ trong ngày
  const loadConsumedFoods = useCallback(async () => {
    try {
      const dateStr = selectedDate.toISOString().split('T')[0];
      const response = await foodDiaryService.getDiaryByDate(dateStr);
      const diaryData = response.data || {};
      
      // Thêm ngày diary vào mỗi entry để hiển thị
      const entriesWithDate = (diaryData.entries || []).map(entry => ({
        ...entry,
        diaryDate: diaryData.date
      }));
      
      setConsumedFoods(entriesWithDate);
    } catch (error) {
      console.error('Load consumed foods error:', error);
      setConsumedFoods([]);
    }
  }, [selectedDate]);

  // Load dữ liệu khi component mount
  useEffect(() => {
    loadFoods();
    loadCalorieTarget();
    loadConsumedFoods();
  }, [loadFoods, loadCalorieTarget, loadConsumedFoods]);

  // Load dữ liệu khi ngày thay đổi
  useEffect(() => {
    loadConsumedFoods();
  }, [selectedDate, loadConsumedFoods]);

  // Lọc thực phẩm theo nhóm và tìm kiếm
  const filteredFoods = useMemo(() => {
    return foods.filter(food => {
      const matchGroup = selectedGroup === 'all' || food.category === selectedGroup;
      const matchSearch = !searchTerm || food.name.toLowerCase().includes(searchTerm.toLowerCase());
      return matchGroup && matchSearch;
    })
  }, [foods, selectedGroup, searchTerm]);

  // Tính tổng calo đã tiêu thụ
  const totalCalories = useMemo(() => 
    consumedFoods.reduce((sum, entry) => sum + (entry.calories || 0), 0),
    [consumedFoods]);

  const totalProtein = useMemo(() =>
    consumedFoods.reduce((sum, entry) => sum + (entry.protein || 0), 0),
    [consumedFoods]);

  const totalCarbs = useMemo(() =>
    consumedFoods.reduce((sum, entry) => sum + (entry.carbs || 0), 0),
    [consumedFoods]);

  const totalFat = useMemo(() =>
    consumedFoods.reduce((sum, entry) => sum + (entry.fat || 0), 0),
    [consumedFoods]);

  // Mở modal thêm thực phẩm
  // useCallback: Modal và CRUD
  const openAddModal = useCallback((food) => {
    setSelectedFood(food);
    setQuantity(100);
    setSelectedMealType('breakfast');
    setShowAddModal(true);
  }, []);

  // Thêm thực phẩm vào nhật ký
  const handleAddFood = useCallback (async () => {
    if (!selectedFood || !quantity) {
      alert('Vui lòng chọn thực phẩm và nhập số lượng');
      return;
    }

    try {
      await foodDiaryService.addFoodEntry({
        foodId: selectedFood._id,
        quantity: parseFloat(quantity),
        unit: selectedFood.unit || 'g',
        mealType: selectedMealType,
        date: selectedDate.toISOString().split('T')[0]
      });
      await loadConsumedFoods();
      setShowAddModal(false);
      alert('Thêm thực phẩm thành công!');
    } catch (error) {
      console.error('Add food error:', error);
      alert('Lỗi khi thêm thực phẩm: ' + error.message);
    }
  }, [selectedFood, quantity, selectedMealType, selectedDate, loadConsumedFoods]);

  // Chỉnh sửa entry
  const handleEditEntry = useCallback((entry) => {
    setEditingEntry({...entry});
  }, []);

  // Lưu chỉnh sửa
  const handleSaveEdit = useCallback(async () => {
    if (!editingEntry) return;

    try {
      await foodDiaryService.updateFoodEntry(editingEntry._id, {
        quantity: parseFloat(editingEntry.quantity),
        mealType: editingEntry.mealType
      });
      await loadConsumedFoods();
      setEditingEntry(null);
      alert('Cập nhật thành công!');
    } catch (error) {
      console.error('Update entry error:', error);
      alert('Lỗi khi cập nhật: ' + error.message);
    }
  }, [editingEntry, loadConsumedFoods]);

  // Xóa entry
  const handleDeleteEntry = useCallback(async (entryId) => {
    if (!confirm('Bạn có chắc chắn muốn xóa?')) return;

    try {
      await foodDiaryService.deleteFoodEntry(entryId);
      await loadConsumedFoods();
      alert('Xóa thành công!');
    } catch (error) {
      console.error('Delete entry error:', error);
      alert('Lỗi khi xóa: ' + error.message);
    }
  }, [loadConsumedFoods]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-[#3C493F] flex items-center justify-center mr-4">
                <span className="text-white text-lg font-bold">🧮</span>
              </div>
              <h1 className="text-2xl font-semibold text-gray-800">Tính toán Calo</h1>
            </div>
            <div className="flex items-center space-x-4">
              <input
                type="date"
                value={selectedDate.toISOString().split('T')[0]}
                onChange={(e) => setSelectedDate(new Date(e.target.value))}
                className="border border-gray-300 rounded px-3 py-2 text-sm"
              />
              <button 
                onClick={loadConsumedFoods}
                className="px-3 py-2 bg-[#3C493F] text-white rounded text-sm hover:bg-[#2a3329]"
              >
                Làm mới
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left Column - Danh sách thực phẩm */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-4 border-b border-gray-200">
                {error && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
                    <p className="text-sm text-red-600">{error}</p>
                  </div>
                )}
              </div>

              {/* Food List Table */}
              <FoodList
                loading={loading}
                filteredFoods={filteredFoods}
                foodGroups={foodGroups}
                selectedGroup={selectedGroup}
                setSelectedGroup={setSelectedGroup}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                error={error}
                openAddModal={openAddModal}
              />
            </div>
          </div>

          {/* Right Column - Thống kê và mục tiêu */}
          <div className="space-y-6">
            {/* Daily Summary */}
            <DailySummary
              selectedDate={selectedDate}
              totalCalories={totalCalories}
              totalProtein={totalProtein}
              totalCarbs={totalCarbs}
              totalFat={totalFat}
              calorieTarget={calorieTarget}
            />


            {/* Meal Distribution */}
            <MealDistribution 
              consumedFoods={consumedFoods} 
              totalCalories={totalCalories} 
            />
          </div>
        </div>

        {/* Bottom Table - Thống kê thực phẩm đã tiêu thụ */}
        <ConsumedFoodsTable
          consumedFoods={consumedFoods}
          editingEntry={editingEntry}
          selectedDate={selectedDate}
          setEditingEntry={setEditingEntry}
          handleEditEntry={handleEditEntry}
          handleSaveEdit={handleSaveEdit}
          handleDeleteEntry={handleDeleteEntry}
        />

      </div>

      {/* Lazy load Add Food Modal */}
      <React.Suspense fallback={<div>Loading...</div>}>
        <AddFoodModal
          showAddModal={showAddModal}
          setShowAddModal={setShowAddModal}
          selectedFood={selectedFood}
          selectedMealType={selectedMealType}
          setSelectedMealType={setSelectedMealType}
          quantity={quantity}
          setQuantity={setQuantity}
          handleAddFood={handleAddFood}
        />
      </React.Suspense>

    </div>
  );
};

export default Calculator;