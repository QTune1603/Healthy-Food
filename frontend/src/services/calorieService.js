import axiosClient from './axiosClient';

const calorieService = {
  // Tính toán calo
  calculateCalories: async (data) => {
    try {
      const response = await axiosClient.post('/calorie/calculate', data);
      return response;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Lỗi khi tính toán calo');
    }
  },

  // Lấy lịch sử tính toán
  getCalculationHistory: async (params = {}) => {
    try {
      const { page = 1, limit = 10 } = params;
      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString()
      });

      const response = await axiosClient.get(`/calorie/history?${queryParams}`);
      return response;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Lỗi khi lấy lịch sử tính toán');
    }
  },

  // Lấy tính toán gần nhất
  getLatestCalculation: async () => {
    try {
      const response = await axiosClient.get('/calorie/latest');
      return response;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Lỗi khi lấy tính toán gần nhất');
    }
  },

  // Lấy thông tin một tính toán
  getCalculationById: async (id) => {
    try {
      const response = await axiosClient.get(`/calorie/${id}`);
      return response;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Lỗi khi lấy thông tin tính toán');
    }
  },

  // Xóa tính toán
  deleteCalculation: async (id) => {
    try {
      const response = await axiosClient.delete(`/calorie/${id}`);
      return response;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Lỗi khi xóa tính toán');
    }
  },

  // Lấy thống kê BMI
  getBMIStats: async (period = 30) => {
    try {
      const response = await axiosClient.get(`/calorie/stats/bmi?period=${period}`);
      return response;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Lỗi khi lấy thống kê BMI');
    }
  }
};

export default calorieService;