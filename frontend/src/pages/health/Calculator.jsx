import { useState, useEffect } from 'react';
import { foodService, foodDiaryService, calorieService } from '../../services';

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

  // Load dữ liệu khi component mount
  useEffect(() => {
    loadFoods();
    loadCalorieTarget();
    loadConsumedFoods();
  }, []);

  // Load dữ liệu khi ngày thay đổi
  useEffect(() => {
    loadConsumedFoods();
  }, [selectedDate]);

  // Load danh sách thực phẩm
  const loadFoods = async () => {
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
  };

  // Load mục tiêu calo
  const loadCalorieTarget = async () => {
    try {
      const response = await calorieService.getLatestCalculation();
      if (response.success) {
        setCalorieTarget(response.data);
      }
    } catch (error) {
      console.error('Load calorie target error:', error);
    }
  };

  // Load thực phẩm đã tiêu thụ trong ngày
  const loadConsumedFoods = async () => {
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
  };

  // Lọc thực phẩm theo nhóm và tìm kiếm
  const filteredFoods = foods.filter(food => {
    const matchesGroup = selectedGroup === 'all' || food.category === selectedGroup;
    const matchesSearch = !searchTerm || food.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesGroup && matchesSearch;
  });

  // Mở modal thêm thực phẩm
  const openAddModal = (food) => {
    setSelectedFood(food);
    setQuantity(100);
    setSelectedMealType('breakfast');
    setShowAddModal(true);
  };

  // Thêm thực phẩm vào nhật ký
  const handleAddFood = async () => {
    if (!selectedFood || !quantity) {
      alert('Vui lòng chọn thực phẩm và nhập số lượng');
      return;
    }

    try {
      const entryData = {
        foodId: selectedFood._id,
        quantity: parseFloat(quantity),
        unit: selectedFood.unit || 'g',
        mealType: selectedMealType,
        date: selectedDate.toISOString().split('T')[0]
      };

      await foodDiaryService.addFoodEntry(entryData);
      await loadConsumedFoods();
      setShowAddModal(false);
      alert('Thêm thực phẩm thành công!');
    } catch (error) {
      console.error('Add food error:', error);
      alert('Lỗi khi thêm thực phẩm: ' + error.message);
    }
  };

  // Chỉnh sửa entry
  const handleEditEntry = (entry) => {
    setEditingEntry({...entry});
  };

  // Lưu chỉnh sửa
  const handleSaveEdit = async () => {
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
  };

  // Xóa entry
  const handleDeleteEntry = async (entryId) => {
    if (!confirm('Bạn có chắc chắn muốn xóa?')) return;

    try {
      await foodDiaryService.deleteFoodEntry(entryId);
      await loadConsumedFoods();
      alert('Xóa thành công!');
    } catch (error) {
      console.error('Delete entry error:', error);
      alert('Lỗi khi xóa: ' + error.message);
    }
  };

  // Tính tổng calo đã tiêu thụ
  const totalCalories = consumedFoods.reduce((sum, entry) => sum + (entry.calories || 0), 0);
  const totalProtein = consumedFoods.reduce((sum, entry) => sum + (entry.protein || 0), 0);
  const totalCarbs = consumedFoods.reduce((sum, entry) => sum + (entry.carbs || 0), 0);
  const totalFat = consumedFoods.reduce((sum, entry) => sum + (entry.fat || 0), 0);

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
                <h3 className="text-lg font-medium text-gray-800 mb-4">Danh sách thực phẩm theo nhóm</h3>
                
                {/* Filters */}
                <div className="flex flex-col sm:flex-row gap-4 mb-4">
                  <div className="flex-1">
                    <input
                      type="text"
                      placeholder="Tìm kiếm thực phẩm..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                    />
                  </div>
                  <div>
                    <select 
                      value={selectedGroup}
                      onChange={(e) => setSelectedGroup(e.target.value)}
                      className="border border-gray-300 rounded px-3 py-2 text-sm"
                    >
                      <option value="all">Tất cả nhóm</option>
                      {foodGroups.map(group => (
                        <option key={group} value={group}>{group}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {error && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
                    <p className="text-sm text-red-600">{error}</p>
                  </div>
                )}
              </div>

              {/* Food List Table */}
              <div className="overflow-x-auto max-h-96 overflow-y-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 sticky top-0">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-600">#</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-600">Tên món</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-600">Nhóm thực phẩm</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-600">Calories/100g</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-600">Đơn vị tính</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-600">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {loading ? (
                      <tr>
                        <td colSpan="6" className="px-4 py-8 text-center text-gray-500">
                          Đang tải dữ liệu...
                        </td>
                      </tr>
                    ) : filteredFoods.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="px-4 py-8 text-center text-gray-500">
                          Không tìm thấy thực phẩm nào
                        </td>
                      </tr>
                    ) : (
                      filteredFoods.map((food, index) => (
                        <tr key={food._id} className="hover:bg-gray-50">
                          <td className="px-4 py-3 text-sm text-gray-900">{index + 1}</td>
                          <td className="px-4 py-3 text-sm font-medium text-gray-900">{food.name}</td>
                          <td className="px-4 py-3 text-sm text-gray-600">
                            <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                              {food.category || 'Chưa phân loại'}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-600">{food.caloriesPer100g || 0}</td>
                          <td className="px-4 py-3 text-sm text-gray-600">{food.unit || 'g'}</td>
                          <td className="px-4 py-3 text-sm">
                            <button 
                              onClick={() => openAddModal(food)}
                              className="px-3 py-1 bg-[#3C493F] text-white rounded text-xs hover:bg-[#2a3329]"
                            >
                              Thêm vào bảng
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Right Column - Thống kê và mục tiêu */}
          <div className="space-y-6">
            {/* Daily Summary */}
            <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
              <h3 className="text-lg font-medium text-gray-800 mb-4">
                Thống kê ngày {selectedDate.getDate()}/{selectedDate.getMonth() + 1}
              </h3>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Tổng Calo</span>
                  <span className="text-lg font-bold text-[#3C493F]">
                    {Math.round(totalCalories)} 
                    {calorieTarget && <span className="text-sm text-gray-500">/{calorieTarget.targetCalories}</span>}
                  </span>
                </div>
                
                {calorieTarget && (
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-[#3C493F] h-2 rounded-full transition-all duration-300"
                      style={{ width: `${Math.min(100, (totalCalories / calorieTarget.targetCalories) * 100)}%` }}
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

            {/* Meal Distribution */}
            <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
              <h3 className="text-lg font-medium text-gray-800 mb-4">Phân bổ theo bữa ăn</h3>
              
              {['breakfast', 'lunch', 'dinner', 'snack'].map(mealType => {
                const mealEntries = consumedFoods.filter(entry => entry.mealType === mealType);
                const mealCalories = mealEntries.reduce((sum, entry) => sum + (entry.calories || 0), 0);
                const percentage = totalCalories > 0 ? (mealCalories / totalCalories) * 100 : 0;
                
                const mealNames = {
                  breakfast: 'Sáng',
                  lunch: 'Trưa', 
                  dinner: 'Tối',
                  snack: 'Snack'
                };

                return (
                  <div key={mealType} className="mb-3">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">{mealNames[mealType]}</span>
                      <span className="font-medium">{Math.round(mealCalories)} kcal ({Math.round(percentage)}%)</span>
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
          </div>
        </div>

        {/* Bottom Table - Thống kê thực phẩm đã tiêu thụ */}
        <div className="mt-6 bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-800">
              Thống kê thực phẩm đã tiêu thụ - {selectedDate.toLocaleDateString('vi-VN')}
            </h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-600">#</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-600">Tên thực phẩm</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-600">Bữa ăn</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-600">Số lượng (khẩu phần)</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-600">Calo</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-600">Ngày tháng tiêu thụ</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-600">Tùy chọn chỉnh sửa (Edit)</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-600">Tùy chọn xóa (Delete)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {consumedFoods.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="px-4 py-8 text-center text-gray-500">
                      Chưa có thực phẩm nào được thêm vào ngày này
                    </td>
                  </tr>
                ) : (
                  consumedFoods.map((entry, index) => (
                    <tr key={entry._id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm text-gray-900">{index + 1}</td>
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">{entry.foodName}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {editingEntry?._id === entry._id ? (
                          <select 
                            value={editingEntry.mealType}
                            onChange={(e) => setEditingEntry({...editingEntry, mealType: e.target.value})}
                            className="border border-gray-300 rounded px-2 py-1 text-xs"
                          >
                            <option value="breakfast">Sáng</option>
                            <option value="lunch">Trưa</option>
                            <option value="dinner">Tối</option>
                            <option value="snack">Snack</option>
                          </select>
                        ) : (
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                            {entry.mealType === 'breakfast' ? 'Sáng' : 
                             entry.mealType === 'lunch' ? 'Trưa' : 
                             entry.mealType === 'dinner' ? 'Tối' : 'Snack'}
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {editingEntry?._id === entry._id ? (
                          <input 
                            type="number"
                            value={editingEntry.quantity}
                            onChange={(e) => setEditingEntry({...editingEntry, quantity: e.target.value})}
                            className="border border-gray-300 rounded px-2 py-1 text-xs w-16"
                          />
                        ) : (
                          `${entry.quantity}${entry.unit}`
                        )}
                      </td>
                      <td className="px-4 py-3 text-sm font-medium text-[#3C493F]">{Math.round(entry.calories || 0)}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {entry.diaryDate ? 
                          new Date(entry.diaryDate).toLocaleDateString('vi-VN') : 
                          entry.createdAt ? 
                            new Date(entry.createdAt).toLocaleDateString('vi-VN') : 
                            selectedDate.toLocaleDateString('vi-VN')
                        }
                      </td>
                      <td className="px-4 py-3 text-sm">
                        {editingEntry?._id === entry._id ? (
                          <div className="flex space-x-1">
                            <button 
                              onClick={handleSaveEdit}
                              className="px-2 py-1 bg-green-500 text-white rounded text-xs hover:bg-green-600"
                            >
                              Lưu
                            </button>
                            <button 
                              onClick={() => setEditingEntry(null)}
                              className="px-2 py-1 bg-gray-500 text-white rounded text-xs hover:bg-gray-600"
                            >
                              Hủy
                            </button>
                          </div>
                        ) : (
                          <button 
                            onClick={() => handleEditEntry(entry)}
                            className="px-2 py-1 bg-blue-500 text-white rounded text-xs hover:bg-blue-600"
                          >
                            Edit
                          </button>
                        )}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <button 
                          onClick={() => handleDeleteEntry(entry._id)}
                          className="px-2 py-1 bg-red-500 text-white rounded text-xs hover:bg-red-600"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add Food Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-medium text-gray-800 mb-4">
              Thêm {selectedFood?.name} vào nhật ký
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Bữa ăn</label>
                <select 
                  value={selectedMealType}
                  onChange={(e) => setSelectedMealType(e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                >
                  <option value="breakfast">Sáng</option>
                  <option value="lunch">Trưa</option>
                  <option value="dinner">Tối</option>
                  <option value="snack">Snack</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Số lượng ({selectedFood?.unit || 'g'})
                </label>
                <input 
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseFloat(e.target.value) || 1))}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                  min="1"
                  step="0.1"
                />
              </div>
              
              <div className="bg-gray-50 p-3 rounded">
                <div className="text-sm text-gray-600">
                  <div>Calo ước tính: <span className="font-medium text-[#3C493F]">
                    {Math.round((selectedFood?.caloriesPer100g || 0) * quantity / 100)} kcal
                  </span></div>
                  {selectedFood?.protein && (
                    <div>Protein: {Math.round((selectedFood.protein || 0) * quantity / 100 * 10) / 10}g</div>
                  )}
                  {selectedFood?.carbs && (
                    <div>Carbs: {Math.round((selectedFood.carbs || 0) * quantity / 100 * 10) / 10}g</div>
                  )}
                  {selectedFood?.fat && (
                    <div>Fat: {Math.round((selectedFood.fat || 0) * quantity / 100 * 10) / 10}g</div>
                  )}
                </div>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 mt-6">
              <button 
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded hover:bg-gray-50"
              >
                Hủy
              </button>
              <button 
                onClick={handleAddFood}
                className="px-4 py-2 bg-[#3C493F] text-white rounded hover:bg-[#2a3329]"
              >
                Thêm vào bảng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Calculator;