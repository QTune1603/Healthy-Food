import React, { memo } from 'react';

const BodyIndexInfo = memo(() => (
  <div className="mt-16 bg-white rounded-2xl p-8 shadow-sm">
    <h3 className="text-2xl font-light text-[#4d544e] mb-6">Thông Tin Về BMI</h3>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {[
        { color: 'blue', title: 'Thiếu cân', range: 'BMI < 18.5', note: 'Cần tăng cân' },
        { color: 'green', title: 'Bình thường', range: 'BMI 18.5 - 24.9', note: 'Cân nặng lý tưởng' },
        { color: 'yellow', title: 'Thừa cân', range: 'BMI 25 - 29.9', note: 'Cần giảm cân' },
        { color: 'red', title: 'Béo phì', range: 'BMI ≥ 30', note: 'Cần giảm cân nhiều' }
      ].map((info) => (
        <div key={info.title} className={`text-center p-4 border border-${info.color}-200 rounded-xl`}>
          <div className={`text-${info.color}-600 font-medium mb-2`}>{info.title}</div>
          <div className="text-sm text-gray-600">{info.range}</div>
          <div className="text-xs text-gray-500 mt-2">{info.note}</div>
        </div>
      ))}
    </div>
  </div>
));

export default BodyIndexInfo;
