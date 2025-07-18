import { useState, useEffect } from 'react';
import { foodService, foodDiaryService, calorieService } from '../../services';

const Calculator = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  
  // State cho thực phẩm
  const [foods, setFoods] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFood, setSelectedFood] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedMealType, setSelectedMealType] = useState('breakfast');
  
  // State cho nhật ký
  const [todayDiary, setTodayDiary] = useState(null);
  const [tableData, setTableData] = useState([]);
  const [nutritionStats, setNutritionStats] = useState(null);
  
  // State cho tính toán calo
  const [calorieTarget, setCalorieTarget] = useState(null);
  
  // Loading states
  const [isLoading, setIsLoading] = useState(false);
  const [isAddingFood, setIsAddingFood] = useState(false);
  const [error, setError] = useState(null);

  // Lấy dữ liệu khi component mount
  useEffect(() => {
    loadTodayDiary();
    loadTableData();
    loadNutritionStats();
    loadLatestCalorieCalculation();
  }, []);

  // Lấy dữ liệu khi ngày thay đổi
  useEffect(() => {
    loadTodayDiary();
  }, [selectedDate]);

  // Tìm kiếm thực phẩm
  useEffect(() => {
    if (searchTerm.trim()) {
      searchFoods();
    } else {
      setFoods([]);
    }
  }, [searchTerm]);

  // Lấy tính toán calo gần nhất
  const loadLatestCalorieCalculation = async () => {
    try {
      const response = await calorieService.getLatestCalculation();
      if (response.success) {
        setCalorieTarget(response.data);
      }
    } catch (error) {
      console.error('Load calorie calculation error:', error);
      // Không hiển thị error vì không bắt buộc phải có
    }
  };

  // Tìm kiếm thực phẩm
  const searchFoods = async () => {
    try {
      const response = await foodService.searchFoods(searchTerm, 10);
      setFoods(response.data || []);
    } catch (error) {
      console.error('Search foods error:', error);
      setFoods([]);
    }
  };

  // Lấy nhật ký hôm nay
  const loadTodayDiary = async () => {
    try {
      const dateStr = selectedDate.toISOString().split('T')[0];
      const response = await foodDiaryService.getDiaryByDate(dateStr);
      setTodayDiary(response.data);
    } catch (error) {
      console.error('Load today diary error:', error);
      setTodayDiary({
        date: selectedDate,
        entries: [],
        totalCalories: 0,
        totalProtein: 0,
        totalCarbs: 0,
        totalFat: 0
      });
    }
  };

  // Lấy dữ liệu bảng (7 ngày gần nhất)
  const loadTableData = async () => {
    try {
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - 6);
      
      const response = await foodDiaryService.getDiaryByRange({
        startDate: startDate.toISOString().split('T')[0],
        endDate: endDate.toISOString().split('T')[0],
        limit: 7
      });
      
      const diaries = response.data.diaries || [];
      const formattedData = diaries.map(diary => {
        const date = new Date(diary.date);
        const dateStr = `${date.getDate().toString().padStart(2, '0')}.${(date.getMonth() + 1).toString().padStart(2, '0')}`;
        
        const breakfast = diary.entries.find(e => e.mealType === 'breakfast')?.foodName || '-';
        const lunch = diary.entries.find(e => e.mealType === 'lunch')?.foodName || '-';
        const dinner = diary.entries.find(e => e.mealType === 'dinner')?.foodName || '-';
        const snack = diary.entries.find(e => e.mealType === 'snack')?.foodName || '-';
        
        return {
          date: dateStr,
          breakfast,
          lunch,
          dinner,
          snack,
          calories: diary.totalCalories || 0
        };
      });
      
      setTableData(formattedData);
    } catch (error) {
      console.error('Load table data error:', error);
      setTableData([]);
    }
  };

  // Lấy thống kê dinh dưỡng
  const loadNutritionStats = async () => {
    try {
      const response = await foodDiaryService.getNutritionStats(7);
      setNutritionStats(response.data);
    } catch (error) {
      console.error('Load nutrition stats error:', error);
      setNutritionStats(null);
    }
  };

  // Thêm thực phẩm vào nhật ký
  const handleAddFood = async () => {
    if (!selectedFood || !quantity) {
      alert('Vui lòng chọn thực phẩm và nhập số lượng');
      return;
    }

    setIsAddingFood(true);
    setError(null);

    try {
      const entryData = {
        foodId: selectedFood._id,
        quantity: parseFloat(quantity),
        unit: selectedFood.unit,
        mealType: selectedMealType,
        date: selectedDate.toISOString().split('T')[0]
      };

      await foodDiaryService.addFoodEntry(entryData);
      
      // Reset form
      setSelectedFood(null);
      setQuantity(1);
      setSearchTerm('');
      setFoods([]);
      
      // Reload data
      await loadTodayDiary();
      await loadTableData();
      await loadNutritionStats();
      
      alert('Thêm thực phẩm thành công!');
    } catch (error) {
      console.error('Add food error:', error);
      setError(error.message);
    } finally {
      setIsAddingFood(false);
    }
  };

  // Xóa entry
  const handleDeleteEntry = async (diaryId, entryId) => {
    if (!confirm('Bạn có chắc chắn muốn xóa?')) return;

    try {
      await foodDiaryService.deleteFoodEntry(diaryId, entryId);
      await loadTodayDiary();
      await loadTableData();
      await loadNutritionStats();
      alert('Xóa thành công!');
    } catch (error) {
      console.error('Delete entry error:', error);
      alert('Lỗi khi xóa: ' + error.message);
    }
  };

  // Tính toán phần trăm đạt được
  const getProgressPercentage = (current, target) => {
    if (!target) return 0;
    return Math.min(100, Math.round((current / target) * 100));
  };

  // Calendar helper functions
  const getDaysInMonth = (month, year) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (month, year) => {
    return new Date(year, month, 1).getDay();
  };

  const generateCalendar = () => {
    const daysInMonth = getDaysInMonth(selectedMonth, selectedYear);
    const firstDay = getFirstDayOfMonth(selectedMonth, selectedYear);
    const days = [];

    // Empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }

    return days;
  };

  const monthNames = [
    'Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6',
    'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'
  ];

  const weekDays = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];

  const handlePrevMonth = () => {
    if (selectedMonth === 0) {
      setSelectedMonth(11);
      setSelectedYear(selectedYear - 1);
    } else {
      setSelectedMonth(selectedMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (selectedMonth === 11) {
      setSelectedMonth(0);
      setSelectedYear(selectedYear + 1);
    } else {
      setSelectedMonth(selectedMonth + 1);
    }
  };

  // Tính toán dữ liệu biểu đồ
  const getChartData = () => {
    if (!todayDiary || !todayDiary.entries || todayDiary.entries.length === 0) {
      return [
        { label: 'Sáng', value: 0, color: '#3C493F' },
        { label: 'Trưa', value: 0, color: '#4a5a4e' },
        { label: 'Tối', value: 0, color: '#586b5d' },
        { label: 'Snack', value: 0, color: '#667c6c' },
      ];
    }

    const mealCalories = {
      breakfast: 0,
      lunch: 0,
      dinner: 0,
      snack: 0
    };

    todayDiary.entries.forEach(entry => {
      mealCalories[entry.mealType] += entry.calories;
    });

    const total = Object.values(mealCalories).reduce((sum, cal) => sum + cal, 0);
    
    return [
      { label: 'Sáng', value: total > 0 ? Math.round((mealCalories.breakfast / total) * 100) : 0, color: '#3C493F' },
      { label: 'Trưa', value: total > 0 ? Math.round((mealCalories.lunch / total) * 100) : 0, color: '#4a5a4e' },
      { label: 'Tối', value: total > 0 ? Math.round((mealCalories.dinner / total) * 100) : 0, color: '#586b5d' },
      { label: 'Snack', value: total > 0 ? Math.round((mealCalories.snack / total) * 100) : 0, color: '#667c6c' },
    ];
  };

  const chartData = getChartData();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-[#3C493F] flex items-center justify-center mr-4">
              <span className="text-white text-lg font-bold">H</span>
            </div>
            <h1 className="text-2xl font-semibold text-gray-800">Tính toán calo</h1>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Sidebar - Calendar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <button 
                  onClick={handlePrevMonth}
                  className="p-1 hover:bg-gray-50 rounded transition-colors"
                >
                  <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <h3 className="text-sm font-medium text-gray-700">
                  {monthNames[selectedMonth]} {selectedYear}
                </h3>
                <button 
                  onClick={handleNextMonth}
                  className="p-1 hover:bg-gray-50 rounded transition-colors"
                >
                  <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>

              {/* Calendar Grid */}
              <div className="grid grid-cols-7 gap-1 mb-2">
                {weekDays.map((day) => (
                  <div key={day} className="text-center text-xs font-medium text-gray-500 py-1">
                    {day}
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-1">
                {generateCalendar().map((day, index) => (
                  <button
                    key={index}
                    className={`aspect-square flex items-center justify-center text-xs rounded transition-colors ${
                      day === selectedDate.getDate() && 
                      selectedMonth === selectedDate.getMonth() && 
                      selectedYear === selectedDate.getFullYear()
                        ? 'bg-[#3C493F] text-white'
                        : day
                        ? 'hover:bg-gray-50 text-gray-700'
                        : ''
                    }`}
                    onClick={() => day && setSelectedDate(new Date(selectedYear, selectedMonth, day))}
                  >
                    {day}
                  </button>
                ))}
              </div>
            </div>

            {/* Daily Summary với Target */}
            <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 mt-4">
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 rounded-full bg-[#3C493F] flex items-center justify-center mr-3">
                  <span className="text-white text-sm font-bold">H</span>
                </div>
                <h3 className="text-sm font-medium text-gray-700">Hôm Nay</h3>
              </div>

              {/* Calories Progress */}
              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs text-gray-600">Calo</span>
                  <span className="text-sm font-medium text-gray-800">
                    {todayDiary?.totalCalories || 0}{calorieTarget ? ` / ${calorieTarget.targetCalories}` : ''} kcal
                  </span>
                </div>
                {calorieTarget && (
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-[#3C493F] h-2 rounded-full transition-all duration-300"
                      style={{ width: `${getProgressPercentage(todayDiary?.totalCalories || 0, calorieTarget.targetCalories)}%` }}
                    ></div>
                  </div>
                )}
              </div>

              {/* Macros */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-600">Protein</span>
                  <span className="text-sm font-medium text-gray-800">
                    {todayDiary?.totalProtein || 0}{calorieTarget ? ` / ${calorieTarget.protein}` : ''}g
                  </span>
                </div>
                {calorieTarget && (
                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                    <div 
                      className="bg-blue-500 h-1.5 rounded-full transition-all duration-300"
                      style={{ width: `${getProgressPercentage(todayDiary?.totalProtein || 0, calorieTarget.protein)}%` }}
                    ></div>
                  </div>
                )}
                
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-600">Carbs</span>
                  <span className="text-sm font-medium text-gray-800">
                    {todayDiary?.totalCarbs || 0}{calorieTarget ? ` / ${calorieTarget.carbs}` : ''}g
                  </span>
                </div>
                {calorieTarget && (
                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                    <div 
                      className="bg-green-500 h-1.5 rounded-full transition-all duration-300"
                      style={{ width: `${getProgressPercentage(todayDiary?.totalCarbs || 0, calorieTarget.carbs)}%` }}
                    ></div>
                  </div>
                )}
                
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-600">Chất béo</span>
                  <span className="text-sm font-medium text-gray-800">
                    {todayDiary?.totalFat || 0}{calorieTarget ? ` / ${calorieTarget.fats}` : ''}g
                  </span>
                </div>
                {calorieTarget && (
                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                    <div 
                      className="bg-yellow-500 h-1.5 rounded-full transition-all duration-300"
                      style={{ width: `${getProgressPercentage(todayDiary?.totalFat || 0, calorieTarget.fats)}%` }}
                    ></div>
                  </div>
                )}
              </div>

              {/* BMI Info */}
              {calorieTarget && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-600">BMI</span>
                    <span className="text-sm font-medium text-gray-800">
                      {calorieTarget.bmi}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {calorieTarget.bmiCategory === 'normal' ? 'Bình thường' :
                     calorieTarget.bmiCategory === 'underweight' ? 'Thiếu cân' :
                     calorieTarget.bmiCategory === 'overweight' ? 'Thừa cân' : 'Béo phì'}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {calorieTarget.goalDescription}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Food Statistics */}
            <div className="bg-white rounded-lg shadow-sm mb-6 border border-gray-200">
              <div className="p-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-800 mb-4">Thống kê các món ăn theo ngày</h3>
                
                {error && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
                    <p className="text-sm text-red-600">{error}</p>
                  </div>
                )}
                
                <div className="space-y-4">
                  {/* Tìm kiếm thực phẩm */}
                  <div className="flex items-center space-x-4">
                    <div className="flex-1 relative">
                      <label className="text-sm text-gray-600 mb-1 block">Tìm kiếm thực phẩm</label>
                      <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Nhập tên thực phẩm..."
                        className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                      />
                      {foods.length > 0 && (
                        <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-48 overflow-y-auto">
                          {foods.map((food) => (
                            <button
                              key={food._id}
                              onClick={() => {
                                setSelectedFood(food);
                                setSearchTerm(food.name);
                                setFoods([]);
                              }}
                              className="w-full px-3 py-2 text-left hover:bg-gray-50 text-sm"
                            >
                              <div className="font-medium">{food.name}</div>
                              <div className="text-gray-500 text-xs">
                                {food.caloriesPer100g} kcal/100{food.unit}
                              </div>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Form thêm thực phẩm */}
                  {selectedFood && (
                    <div className="flex items-end space-x-4">
                      <div>
                        <label className="text-sm text-gray-600 mb-1 block">Bữa ăn</label>
                        <select 
                          value={selectedMealType}
                          onChange={(e) => setSelectedMealType(e.target.value)}
                          className="border border-gray-300 rounded px-3 py-2 text-sm"
                        >
                          <option value="breakfast">Sáng</option>
                          <option value="lunch">Trưa</option>
                          <option value="dinner">Tối</option>
                          <option value="snack">Snack</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-sm text-gray-600 mb-1 block">Số lượng</label>
                        <div className="flex items-center space-x-2">
                          <button 
                            onClick={() => setQuantity(Math.max(1, quantity - 1))}
                            className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-sm hover:bg-gray-200"
                          >
                            -
                          </button>
                          <input 
                            type="number" 
                            value={quantity}
                            onChange={(e) => setQuantity(Math.max(1, parseFloat(e.target.value) || 1))}
                            className="border border-gray-300 rounded px-3 py-2 text-sm w-20 text-center" 
                          />
                          <button 
                            onClick={() => setQuantity(quantity + 1)}
                            className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-sm hover:bg-gray-200"
                          >
                            +
                          </button>
                          <span className="text-sm text-gray-600">{selectedFood.unit}</span>
                        </div>
                      </div>
                      <div>
                        <label className="text-sm text-gray-600 mb-1 block">Calo ước tính</label>
                        <input 
                          type="number" 
                          value={Math.round(selectedFood.caloriesPer100g * quantity / 100)}
                          readOnly
                          className="border border-gray-300 rounded px-3 py-2 text-sm w-20 bg-gray-50"
                        />
                      </div>
                      <button 
                        onClick={handleAddFood}
                        disabled={isAddingFood}
                        className="px-4 py-2 bg-[#3C493F] text-white rounded text-sm hover:bg-[#2a3329] disabled:opacity-50"
                      >
                        {isAddingFood ? 'Đang thêm...' : 'Thêm vào bảng'}
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Food Statistics Table */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-600">#</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-600">Thực phẩm</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-600">Bữa ăn</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-600">Số lượng</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-600">Calo</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-600">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {todayDiary?.entries?.map((entry, index) => (
                      <tr key={entry._id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm text-gray-900">{index + 1}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">{entry.foodName}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">
                          {entry.mealType === 'breakfast' ? 'Sáng' : 
                           entry.mealType === 'lunch' ? 'Trưa' : 
                           entry.mealType === 'dinner' ? 'Tối' : 'Snack'}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">{entry.quantity}{entry.unit}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">{entry.calories}</td>
                        <td className="px-4 py-3 text-sm">
                          <button 
                            onClick={() => handleDeleteEntry(todayDiary._id, entry._id)}
                            className="px-2 py-1 bg-red-500 text-white rounded text-xs hover:bg-red-600"
                          >
                            Xóa
                          </button>
                        </td>
                      </tr>
                    ))}
                    {(!todayDiary?.entries || todayDiary.entries.length === 0) && (
                      <tr>
                        <td colSpan="6" className="px-4 py-8 text-center text-gray-500">
                          Chưa có dữ liệu cho ngày này
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Data Table */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6 border border-gray-200">
              <div className="p-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-[#3C493F] flex items-center justify-center mr-3">
                      <span className="text-white text-sm font-bold">H</span>
                    </div>
                    <h3 className="text-lg font-medium text-gray-800">Nhật Ký Dinh Dưỡng (7 ngày gần nhất)</h3>
                  </div>
                  <button 
                    onClick={loadTableData}
                    className="px-3 py-1 bg-gray-100 text-gray-700 rounded text-sm hover:bg-gray-200 transition-colors"
                  >
                    Làm mới
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-600">Ngày</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-600">Sáng</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-600">Trưa</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-600">Tối</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-600">Snack</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-600">Tổng Calo</th>
                      {calorieTarget && (
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-600">Đạt mục tiêu</th>
                      )}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {tableData.map((row, index) => (
                      <tr key={index} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-3 text-sm text-gray-900">{row.date}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">{row.breakfast}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">{row.lunch}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">{row.dinner}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">{row.snack}</td>
                        <td className="px-4 py-3 text-sm font-medium text-[#3C493F]">{row.calories}</td>
                        {calorieTarget && (
                          <td className="px-4 py-3 text-sm">
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              row.calories >= calorieTarget.targetCalories * 0.9 && row.calories <= calorieTarget.targetCalories * 1.1
                                ? 'bg-green-100 text-green-800'
                                : row.calories < calorieTarget.targetCalories * 0.9
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {Math.round((row.calories / calorieTarget.targetCalories) * 100)}%
                            </span>
                          </td>
                        )}
                      </tr>
                    ))}
                    {tableData.length === 0 && (
                      <tr>
                        <td colSpan={calorieTarget ? "7" : "6"} className="px-4 py-8 text-center text-gray-500">
                          Chưa có dữ liệu
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Pie Chart */}
              <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
                <div className="flex items-center mb-4">
                  <div className="w-8 h-8 rounded-full bg-[#3C493F] flex items-center justify-center mr-3">
                    <span className="text-white text-sm font-bold">H</span>
                  </div>
                  <h3 className="text-lg font-medium text-gray-800">Phân Bổ Calo Hôm Nay</h3>
                </div>
                <div className="flex items-center justify-center mb-4">
                  <div className="relative w-32 h-32">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                      <circle
                        cx="50"
                        cy="50"
                        r="35"
                        fill="none"
                        stroke="#f3f4f6"
                        strokeWidth="6"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-lg font-medium text-gray-800">
                          {todayDiary?.totalCalories || 0}
                        </div>
                        <div className="text-xs text-gray-500">kcal</div>
                        {calorieTarget && (
                          <div className="text-xs text-gray-400">
                            /{calorieTarget.targetCalories}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  {chartData.map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div 
                          className="w-3 h-3 rounded-full mr-2" 
                          style={{ backgroundColor: item.color }}
                        ></div>
                        <span className="text-sm text-gray-600">{item.label}</span>
                      </div>
                      <span className="text-sm font-medium text-gray-800">{item.value}%</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bar Chart */}
              <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
                <div className="flex items-center mb-4">
                  <div className="w-8 h-8 rounded-full bg-[#3C493F] flex items-center justify-center mr-3">
                    <span className="text-white text-sm font-bold">H</span>
                  </div>
                  <h3 className="text-lg font-medium text-gray-800">Xu Hướng 7 Ngày</h3>
                </div>
                <div className="flex items-end justify-between h-32 mb-4">
                  {nutritionStats?.dailyData?.slice(-7).map((data, index) => {
                    const targetCalories = calorieTarget?.targetCalories || 2000;
                    const heightPercentage = Math.max(5, (data.calories / targetCalories) * 100);
                    const isOnTarget = data.calories >= targetCalories * 0.9 && data.calories <= targetCalories * 1.1;
                    
                    return (
                      <div key={index} className="flex flex-col items-center">
                        <div 
                          className={`rounded-t w-6 transition-all ${
                            isOnTarget ? 'bg-green-500 hover:bg-green-600' : 
                            data.calories < targetCalories * 0.9 ? 'bg-yellow-500 hover:bg-yellow-600' :
                            'bg-red-500 hover:bg-red-600'
                          }`}
                          style={{ height: `${Math.min(heightPercentage, 100)}%` }}
                          title={`${data.calories} kcal`}
                        ></div>
                        <div className="text-xs text-gray-500 mt-2">
                          {new Date(data.date).getDate()}
                        </div>
                      </div>
                    );
                  }) || Array.from({length: 7}, (_, index) => (
                    <div key={index} className="flex flex-col items-center">
                      <div className="bg-gray-200 rounded-t w-6 h-4"></div>
                      <div className="text-xs text-gray-500 mt-2">-</div>
                    </div>
                  ))}
                </div>
                <div className="text-center">
                  <div className="text-sm text-gray-500">
                    Trung bình: {nutritionStats?.averages?.calories || 0} kcal/ngày
                    {calorieTarget && (
                      <span className="ml-2 text-gray-400">
                        (Mục tiêu: {calorieTarget.targetCalories} kcal)
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Calculator; 