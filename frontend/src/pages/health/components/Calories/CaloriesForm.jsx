import React, { memo } from 'react';

const CaloriesForm = memo(({ formData, error, loading, handleInputChange, calculateCalories, resetForm }) => {
  return (
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
          <label className="block text-sm font-medium text-gray-700 mb-2">Chiều cao</label>
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
          <label className="block text-sm font-medium text-gray-700 mb-2">Cân nặng</label>
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
          <label className="block text-sm font-medium text-gray-700 mb-2">Tuổi</label>
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
          <label className="block text-sm font-medium text-gray-700 mb-2">Giới tính</label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => handleInputChange({ target: { name: 'gender', value: 'male' } })}
              className={`px-4 py-3 rounded-xl border transition-all ${formData.gender === 'male'
                ? 'bg-[#4d544e] text-white border-[#4d544e]'
                : 'bg-white text-gray-700 border-gray-200 hover:border-[#4d544e]'}`}
            >
              Nam
            </button>
            <button
              type="button"
              onClick={() => handleInputChange({ target: { name: 'gender', value: 'female' } })}
              className={`px-4 py-3 rounded-xl border transition-all ${formData.gender === 'female'
                ? 'bg-[#4d544e] text-white border-[#4d544e]'
                : 'bg-white text-gray-700 border-gray-200 hover:border-[#4d544e]'}`}
            >
              Nữ
            </button>
          </div>
        </div>

        {/* Activity Level */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Mức độ hoạt động</label>
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
          <label className="block text-sm font-medium text-gray-700 mb-2">Mục tiêu</label>
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
  );
});

export default CaloriesForm;
