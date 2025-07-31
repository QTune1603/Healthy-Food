import React, { memo } from 'react';

const BodyIndexForm = memo(({ formData, handleInputChange, calculateBMI, resetForm }) => {
  return (
    <div className="bg-white rounded-2xl p-8 shadow-sm">
      <h2 className="text-2xl font-light text-[#4d544e] mb-8">Nhập Thông Tin Cơ Thể</h2>
      <div className="space-y-6">
        {[
          { label: 'Chiều cao (cm)', name: 'height', placeholder: 'Ví dụ: 170' },
          { label: 'Cân nặng (kg)', name: 'weight', placeholder: 'Ví dụ: 65' },
          { label: 'Tuổi', name: 'age', placeholder: 'Ví dụ: 25' }
        ].map((field) => (
          <div key={field.name}>
            <label className="block text-sm font-medium text-gray-700 mb-2">{field.label}</label>
            <input
              type="number"
              name={field.name}
              value={formData[field.name]}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4d544e]/20"
              placeholder={field.placeholder}
            />
          </div>
        ))}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Giới tính</label>
          <div className="grid grid-cols-2 gap-3">
            {['male', 'female'].map((gender) => (
              <button
                key={gender}
                type="button"
                onClick={() => handleInputChange({ target: { name: 'gender', value: gender } })}
                className={`px-4 py-3 rounded-xl border transition-all ${
                  formData.gender === gender
                    ? 'bg-[#4d544e] text-white border-[#4d544e]'
                    : 'bg-white text-gray-700 border-gray-200 hover:border-[#4d544e]'
                }`}
              >
                {gender === 'male' ? 'Nam' : 'Nữ'}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Mức độ hoạt động</label>
          <select
            name="activityLevel"
            value={formData.activityLevel}
            onChange={handleInputChange}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2"
          >
            <option value="sedentary">Ít vận động</option>
            <option value="light">Vận động nhẹ</option>
            <option value="moderate">Vận động vừa</option>
            <option value="active">Vận động nhiều</option>
            <option value="veryActive">Vận động rất nhiều</option>
          </select>
        </div>

        <div className="flex gap-4 pt-4">
          <button
            onClick={calculateBMI}
            className="flex-1 bg-[#4d544e] text-white py-3 px-6 rounded-xl hover:bg-[#3a403a]"
          >
            Tính Toán
          </button>
          <button
            onClick={resetForm}
            className="flex-1 bg-gray-100 text-gray-700 py-3 px-6 rounded-xl hover:bg-gray-200"
          >
            Đặt Lại
          </button>
        </div>
      </div>
    </div>
  );
});

export default BodyIndexForm;
