import axiosClient from './axiosClient';

const bodyMetricsService = {
  // Chỉ tính toán không lưu (cho preview)
  calculateOnly: async (data) => {
    try {
      const response = await axiosClient.post('/body-metrics/calculate', data);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Lỗi khi tính toán chỉ số cơ thể');
    }
  },

  // Tính toán và lưu chỉ số cơ thể
  calculateAndSave: async (data) => {
    try {
      const response = await axiosClient.post('/body-metrics', data);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Lỗi khi lưu chỉ số cơ thể');
    }
  },

  // Lấy lịch sử chỉ số cơ thể
  getHistory: async (page = 1, limit = 10) => {
    try {
      const response = await axiosClient.get(`/body-metrics?page=${page}&limit=${limit}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Lỗi khi lấy lịch sử chỉ số cơ thể');
    }
  },

  // Lấy chỉ số cơ thể mới nhất
  getLatest: async () => {
    try {
      const response = await axiosClient.get('/body-metrics/latest');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Lỗi khi lấy chỉ số cơ thể mới nhất');
    }
  },

  // Lấy thống kê chỉ số cơ thể
  getStats: async (period = 30) => {
    try {
      const response = await axiosClient.get(`/body-metrics/stats?period=${period}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Lỗi khi lấy thống kê chỉ số cơ thể');
    }
  },

  // Xóa một bản ghi chỉ số cơ thể
  deleteMetrics: async (id) => {
    try {
      const response = await axiosClient.delete(`/body-metrics/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Lỗi khi xóa chỉ số cơ thể');
    }
  }
};

export default bodyMetricsService; 