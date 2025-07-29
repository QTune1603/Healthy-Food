//Modal thêm món ăn
import React from 'react';

const AddFoodModal = ({
  showAddModal,
  setShowAddModal,
  selectedFood,
  selectedMealType,
  setSelectedMealType,
  quantity,
  setQuantity,
  handleAddFood
}) => {
  if (!showAddModal) return null; // Không render nếu modal chưa mở

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <h3 className="text-lg font-medium text-gray-800 mb-4">
          Thêm {selectedFood?.name} vào nhật ký
        </h3>
        
        <div className="space-y-4">
          {/* Chọn bữa ăn */}
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
          
          {/* Nhập số lượng */}
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
          
          {/* Thông tin dinh dưỡng ước tính */}
          <div className="bg-gray-50 p-3 rounded">
            <div className="text-sm text-gray-600">
              <div>
                Calo ước tính:{' '}
                <span className="font-medium text-[#3C493F]">
                  {Math.round((selectedFood?.caloriesPer100g || 0) * quantity / 100)} kcal
                </span>
              </div>
              {selectedFood?.protein && (
                <div>
                  Protein: {Math.round((selectedFood.protein || 0) * quantity / 100 * 10) / 10}g
                </div>
              )}
              {selectedFood?.carbs && (
                <div>
                  Carbs: {Math.round((selectedFood.carbs || 0) * quantity / 100 * 10) / 10}g
                </div>
              )}
              {selectedFood?.fat && (
                <div>
                  Fat: {Math.round((selectedFood.fat || 0) * quantity / 100 * 10) / 10}g
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Action buttons */}
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
  );
};

export default React.memo(AddFoodModal);
