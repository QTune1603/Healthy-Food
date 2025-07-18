import { useState, useEffect } from 'react';
import { dashboardService } from '../services';

const Dashboard = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  // API Data states
  const [dashboardData, setDashboardData] = useState(null);
  const [radarData, setRadarData] = useState(null);
  const [healthTrends, setHealthTrends] = useState([]);
  const [nutritionStats, setNutritionStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load dashboard data
  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Load APIs one by one để debug dễ hơn
      console.log('Loading dashboard overview...');
      const overview = await dashboardService.getOverview();
      console.log('Overview response:', overview);
      setDashboardData(overview?.data || null);

      console.log('Loading body metrics...');
      const bodyMetrics = await dashboardService.getBodyMetricsRadarData();
      console.log('Body metrics response:', bodyMetrics);
      setRadarData(bodyMetrics?.data?.radarData || null);

      console.log('Loading health trends...');
      const trends = await dashboardService.getHealthTrends({ period: 'monthly', limit: 12 });
      console.log('Trends response:', trends);
      setHealthTrends(trends?.data?.chartData || []);

      console.log('Loading nutrition stats...');
      const nutrition = await dashboardService.getNutritionStats(7);
      console.log('Nutrition response:', nutrition);
      setNutritionStats(nutrition?.data?.chartData || []);

    } catch (error) {
      console.error('Load dashboard data error:', error);
      setError(error.message);
      // Set fallback data nếu có lỗi
      setFallbackData();
    } finally {
      setLoading(false);
    }
  };

  const setFallbackData = () => {
    // Mock data fallback
    setHealthTrends([
      { month: 'Th1', value: 65 },
      { month: 'Th2', value: 70 },
      { month: 'Th3', value: 55 },
      { month: 'Th4', value: 75 },
      { month: 'Th5', value: 60 },
      { month: 'Th6', value: 80 },
      { month: 'Th7', value: 70 },
      { month: 'Th8', value: 85 },
      { month: 'Th9', value: 75 },
      { month: 'Th10', value: 90 },
      { month: 'Th11', value: 85 },
      { month: 'Th12', value: 95 }
    ]);

    setNutritionStats([
      { day: 'T2', protein: 45, carbs: 65, fat: 25, fiber: 30 },
      { day: 'T3', protein: 50, carbs: 70, fat: 30, fiber: 35 },
      { day: 'T4', protein: 40, carbs: 60, fat: 20, fiber: 25 },
      { day: 'T5', protein: 55, carbs: 75, fat: 35, fiber: 40 },
      { day: 'T6', protein: 60, carbs: 80, fat: 40, fiber: 45 },
      { day: 'T7', protein: 50, carbs: 70, fat: 30, fiber: 35 },
      { day: 'CN', protein: 45, carbs: 65, fat: 25, fiber: 30 }
    ]);

    setRadarData({
      weight: 80,
      height: 85,
      bmi: 75,
      age: 90,
      activity: 70,
      health: 85
    });
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

  // Tính radar chart points từ data
  const getRadarPoints = () => {
    if (!radarData) return "0,-120 104,-60 78,90 0,90 -78,45 -104,-60";
    
    const { weight = 70, height = 85, bmi = 75, age = 90, activity = 70, health = 85 } = radarData;
    const scale = 1.5; // Scale factor
    
    // Convert scores (0-100) to coordinates
    const coords = [
      { x: 0, y: -(health * scale) }, // Health (top)
      { x: (height * scale * 0.87), y: -(height * scale * 0.5) }, // Height (top right)
      { x: (bmi * scale * 0.87), y: (bmi * scale * 0.5) }, // BMI (bottom right)
      { x: 0, y: (age * scale) }, // Age (bottom)
      { x: -(activity * scale * 0.87), y: (activity * scale * 0.5) }, // Activity (bottom left)
      { x: -(weight * scale * 0.87), y: -(weight * scale * 0.5) } // Weight (top left)
    ];
    
    return coords.map(coord => `${coord.x},${coord.y}`).join(' ');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#3C493F] mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải dữ liệu dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-[#3C493F] flex items-center justify-center mr-4">
                <span className="text-white text-lg font-bold">H</span>
              </div>
              <h1 className="text-2xl font-semibold text-gray-800">Dashboard Sức Khỏe</h1>
            </div>
            <button 
              onClick={loadDashboardData}
              className="px-3 py-1 bg-[#3C493F] text-white rounded text-sm hover:bg-[#2a3329] transition-colors"
            >
              Làm mới
            </button>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-yellow-700">
                  Không thể tải dữ liệu từ server. Hiển thị dữ liệu mẫu.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Left Sidebar - Calendar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <button 
                  onClick={handlePrevMonth}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <h3 className="text-lg font-medium text-gray-800">
                  {monthNames[selectedMonth]} {selectedYear}
                </h3>
                <button 
                  onClick={handleNextMonth}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>

              {/* Calendar Grid */}
              <div className="grid grid-cols-7 gap-1 mb-4">
                {weekDays.map((day) => (
                  <div key={day} className="text-center text-sm font-medium text-gray-500 py-2">
                    {day}
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-1">
                {generateCalendar().map((day, index) => (
                  <button
                    key={index}
                    className={`aspect-square flex items-center justify-center text-sm rounded-lg transition-colors ${
                      day === selectedDate.getDate() && 
                      selectedMonth === selectedDate.getMonth() && 
                      selectedYear === selectedDate.getFullYear()
                        ? 'bg-[#3C493F] text-white'
                        : day
                        ? 'hover:bg-gray-100 text-gray-700'
                        : ''
                    }`}
                    onClick={() => day && setSelectedDate(new Date(selectedYear, selectedMonth, day))}
                  >
                    {day}
                  </button>
                ))}
              </div>
            </div>

            {/* Daily Stats */}
            <div className="bg-white rounded-lg p-4 shadow-sm mt-4">
              <h3 className="text-lg font-medium text-gray-800 mb-4">Thống kê hôm nay</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Calo tiêu thụ</span>
                  <span className="text-sm font-medium text-gray-800">
                    {dashboardData?.today?.stats?.totalCalories || 0} kcal
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Mục tiêu</span>
                  <span className="text-sm font-medium text-gray-800">
                    {dashboardData?.calorieTarget?.targetCalories || 2000} kcal
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">BMI</span>
                  <span className="text-sm font-medium text-gray-800">
                    {dashboardData?.calorieTarget?.bmi || '--'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Điểm tổng thể</span>
                  <span className="text-sm font-medium text-[#3C493F]">
                    {dashboardData?.today?.scores?.overall || 0}/100
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-3 space-y-8">
            {/* Radar Chart Section */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-medium text-gray-800 mb-6">
                Thống kê tổng quan chỉ số cơ thể của bạn
              </h3>
              <div className="flex items-center justify-center">
                <div className="relative w-80 h-80">
                  <svg className="w-full h-full" viewBox="0 0 400 400">
                    {/* Radar Chart Background */}
                    <g transform="translate(200,200)">
                      {/* Grid lines */}
                      {[1, 2, 3, 4, 5].map((level) => (
                        <polygon
                          key={level}
                          points="0,-150 130,-75 130,75 0,150 -130,75 -130,-75"
                          fill="none"
                          stroke="#e5e7eb"
                          strokeWidth="1"
                          transform={`scale(${level / 5})`}
                        />
                      ))}
                      
                      {/* Axis lines */}
                      {[0, 60, 120, 180, 240, 300].map((angle) => (
                        <line
                          key={angle}
                          x1="0"
                          y1="0"
                          x2={Math.cos((angle - 90) * Math.PI / 180) * 150}
                          y2={Math.sin((angle - 90) * Math.PI / 180) * 150}
                          stroke="#e5e7eb"
                          strokeWidth="1"
                        />
                      ))}
                      
                      {/* Data polygon */}
                      <polygon
                        points={getRadarPoints()}
                        fill="rgba(60, 73, 63, 0.2)"
                        stroke="#3C493F"
                        strokeWidth="2"
                      />
                      
                      {/* Data points */}
                      {radarData && Object.values(radarData).map((value, index) => {
                        const angle = (index * 60 - 90) * Math.PI / 180;
                        const radius = value * 1.5;
                        const x = Math.cos(angle) * radius;
                        const y = Math.sin(angle) * radius;
                        
                        return (
                          <circle
                            key={index}
                            cx={x}
                            cy={y}
                            r="4"
                            fill="#3C493F"
                          />
                        );
                      })}
                    </g>
                    
                    {/* Labels */}
                    <text x="200" y="40" textAnchor="middle" className="text-sm fill-gray-600">Sức khỏe</text>
                    <text x="350" y="130" textAnchor="middle" className="text-sm fill-gray-600">Chiều cao</text>
                    <text x="320" y="320" textAnchor="middle" className="text-sm fill-gray-600">BMI</text>
                    <text x="200" y="370" textAnchor="middle" className="text-sm fill-gray-600">Tuổi</text>
                    <text x="80" y="320" textAnchor="middle" className="text-sm fill-gray-600">Hoạt động</text>
                    <text x="50" y="130" textAnchor="middle" className="text-sm fill-gray-600">Cân nặng</text>
                  </svg>
                </div>
              </div>
              <p className="text-center text-sm text-gray-600 mt-4">
                Biểu đồ tổng hợp chỉ số thể lực và tình trạng sức khỏe của bạn
              </p>
            </div>

            {/* Line Chart Section */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-medium text-gray-800 mb-6">
                Xu hướng sức khỏe theo thời gian
              </h3>
              <div className="h-64">
                <svg className="w-full h-full" viewBox="0 0 800 200">
                  {/* Grid lines */}
                  {[0, 1, 2, 3, 4, 5].map((line) => (
                    <line
                      key={line}
                      x1="60"
                      y1={40 + line * 30}
                      x2="740"
                      y2={40 + line * 30}
                      stroke="#f3f4f6"
                      strokeWidth="1"
                    />
                  ))}
                  
                  {/* Y-axis labels */}
                  {[100, 80, 60, 40, 20, 0].map((value, index) => (
                    <text
                      key={value}
                      x="50"
                      y={45 + index * 30}
                      textAnchor="end"
                      className="text-xs fill-gray-500"
                    >
                      {value}
                    </text>
                  ))}
                  
                  {/* Line chart */}
                  {healthTrends.length > 0 && (
                    <polyline
                      points={healthTrends.map((point, index) => 
                        `${80 + index * (660 / Math.max(healthTrends.length - 1, 1))},${190 - (point.value * 1.5)}`
                      ).join(' ')}
                      fill="none"
                      stroke="#3C493F"
                      strokeWidth="2"
                    />
                  )}
                  
                  {/* Data points */}
                  {healthTrends.map((point, index) => (
                    <circle
                      key={index}
                      cx={80 + index * (660 / Math.max(healthTrends.length - 1, 1))}
                      cy={190 - (point.value * 1.5)}
                      r="3"
                      fill="#3C493F"
                      title={`${point.month}: ${point.value}`}
                    />
                  ))}
                  
                  {/* X-axis labels */}
                  {healthTrends.map((point, index) => (
                    <text
                      key={index}
                      x={80 + index * (660 / Math.max(healthTrends.length - 1, 1))}
                      y="210"
                      textAnchor="middle"
                      className="text-xs fill-gray-500"
                    >
                      {point.month}
                    </text>
                  ))}
                </svg>
              </div>
              <p className="text-center text-sm text-gray-600 mt-4">
                Biểu đồ thể hiện sự thay đổi điểm số sức khỏe tổng thể theo thời gian
              </p>
            </div>

            {/* Bar Chart Section */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-medium text-gray-800 mb-6">
                Thống kê dinh dưỡng 7 ngày
              </h3>
              <div className="h-64">
                <svg className="w-full h-full" viewBox="0 0 800 200">
                  {/* Grid lines */}
                  {[0, 1, 2, 3, 4, 5].map((line) => (
                    <line
                      key={line}
                      x1="60"
                      y1={40 + line * 30}
                      x2="740"
                      y2={40 + line * 30}
                      stroke="#f3f4f6"
                      strokeWidth="1"
                    />
                  ))}
                  
                  {/* Y-axis labels */}
                  {[100, 80, 60, 40, 20, 0].map((value, index) => (
                    <text
                      key={value}
                      x="50"
                      y={45 + index * 30}
                      textAnchor="end"
                      className="text-xs fill-gray-500"
                    >
                      {value}g
                    </text>
                  ))}
                  
                  {/* Bar chart */}
                  {nutritionStats.map((data, dayIndex) => {
                    const barWidth = 12;
                    const barSpacing = 4;
                    const groupWidth = barWidth * 4 + barSpacing * 3;
                    const groupX = 80 + dayIndex * 90;
                    
                    return (
                      <g key={dayIndex}>
                        {/* Protein - Green */}
                        <rect
                          x={groupX}
                          y={190 - (data.protein || 0) * 1.5}
                          width={barWidth}
                          height={(data.protein || 0) * 1.5}
                          fill="#10b981"
                          title={`Protein: ${data.protein || 0}g`}
                        />
                        {/* Carbs - Blue */}
                        <rect
                          x={groupX + barWidth + barSpacing}
                          y={190 - (data.carbs || 0) * 1.5}
                          width={barWidth}
                          height={(data.carbs || 0) * 1.5}
                          fill="#3b82f6"
                          title={`Carbs: ${data.carbs || 0}g`}
                        />
                        {/* Fat - Purple */}
                        <rect
                          x={groupX + (barWidth + barSpacing) * 2}
                          y={190 - (data.fat || 0) * 1.5}
                          width={barWidth}
                          height={(data.fat || 0) * 1.5}
                          fill="#8b5cf6"
                          title={`Fat: ${data.fat || 0}g`}
                        />
                        {/* Fiber - Pink */}
                        <rect
                          x={groupX + (barWidth + barSpacing) * 3}
                          y={190 - (data.fiber || 0) * 1.5}
                          width={barWidth}
                          height={(data.fiber || 0) * 1.5}
                          fill="#ec4899"
                          title={`Fiber: ${data.fiber || 0}g`}
                        />
                        
                        {/* Day label */}
                        <text
                          x={groupX + groupWidth / 2}
                          y="210"
                          textAnchor="middle"
                          className="text-xs fill-gray-500"
                        >
                          {data.day}
                        </text>
                      </g>
                    );
                  })}
                </svg>
              </div>
              
              {/* Legend */}
              <div className="flex justify-center space-x-6 mt-4">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-green-500 rounded mr-2"></div>
                  <span className="text-sm text-gray-600">Protein</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-blue-500 rounded mr-2"></div>
                  <span className="text-sm text-gray-600">Carbs</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-purple-500 rounded mr-2"></div>
                  <span className="text-sm text-gray-600">Fat</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-pink-500 rounded mr-2"></div>
                  <span className="text-sm text-gray-600">Fiber</span>
                </div>
              </div>
              
              <p className="text-center text-sm text-gray-600 mt-4">
                Biểu đồ thống kê lượng chất dinh dưỡng tiêu thụ trong tuần qua
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 