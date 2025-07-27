import axiosClient from './axiosClient';

const dashboardService = {
  // Lấy thống kê tổng quan dashboard
  getOverview: async () => {
    try {
      const response = await axiosClient.get('/dashboard/overview');
      return response;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Lỗi khi lấy thống kê tổng quan');
    }
  },

  // Lấy dữ liệu radar chart (chỉ số cơ thể)
  getBodyMetricsRadarData: async () => {
    try {
      const response = await axiosClient.get('/dashboard/body-metrics');
      return response;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Lỗi khi lấy dữ liệu chỉ số cơ thể');
    }
  },

  // Lấy dữ liệu line chart (xu hướng sức khỏe)
  getHealthTrends: async (params = {}) => {
    try {
      const { period = 'monthly', limit = 12 } = params;
      const queryParams = new URLSearchParams({
        period,
        limit: limit.toString()
      });

      const response = await axiosClient.get(`/dashboard/health-trends?${queryParams}`);
      return response;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Lỗi khi lấy dữ liệu xu hướng sức khỏe');
    }
  },

  // Lấy dữ liệu nutrition bar chart
  getNutritionStats: async (days = 7) => {
    try {
      const response = await axiosClient.get(`/dashboard/nutrition-stats?days=${days}`);
      return response;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Lỗi khi lấy thống kê dinh dưỡng');
    }
  },

  // Cập nhật dashboard data
  updateDashboard: async (data) => {
    try {
      const response = await axiosClient.post('/dashboard/update', data);
      return response;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Lỗi khi cập nhật dashboard');
    }
  },

  // Lấy dữ liệu calendar (ngày nào có data)
  getCalendarData: async (params = {}) => {
    try {
      const { startDate, endDate } = params;
      const queryParams = new URLSearchParams();
      if (startDate) queryParams.append('startDate', startDate);
      if (endDate) queryParams.append('endDate', endDate);

      const response = await axiosClient.get(`/dashboard/calendar?${queryParams}`);
      return response;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Lỗi khi lấy dữ liệu calendar');
    }
  },

  // Lấy dữ liệu cho ngày cụ thể
  getDateData: async (date) => {
    try {
      const response = await axiosClient.get(`/dashboard/date/${date}`);
      return response;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Lỗi khi lấy dữ liệu ngày');
    }
  }
};

export default dashboardService;