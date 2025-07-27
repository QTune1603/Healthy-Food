import axiosClient from './axiosClient';

const foodDiaryService = {
  // Thêm thực phẩm vào nhật ký
  addFoodEntry: async (entryData) => {
    try {
      const response = await axiosClient.post('/food-diary/entry', entryData);
      return response;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Lỗi khi thêm thực phẩm vào nhật ký');
    }
  },

  // Lấy nhật ký theo ngày
  getDiaryByDate: async (date) => {
    try {
      const response = await axiosClient.get(`/food-diary/date/${date}`);
      return response;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Lỗi khi lấy nhật ký theo ngày');
    }
  },

  // Lấy nhật ký theo khoảng thời gian
  getDiaryByRange: async (params = {}) => {
    try {
      const { startDate, endDate, page = 1, limit = 10 } = params;
      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString()
      });
      
      if (startDate) queryParams.append('startDate', startDate);
      if (endDate) queryParams.append('endDate', endDate);

      const response = await axiosClient.get(`/food-diary/range?${queryParams}`);
      return response;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Lỗi khi lấy nhật ký theo khoảng thời gian');
    }
  },

  // Cập nhật entry trong nhật ký
  updateFoodEntry: async (entryId, updateData) => {
    try {
      const response = await axiosClient.put(`/food-diary/entry/${entryId}`, updateData);
      return response;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Lỗi khi cập nhật entry');
    }
  },

  // Xóa entry khỏi nhật ký
  deleteFoodEntry: async (entryId) => {
    try {
      const response = await axiosClient.delete(`/food-diary/entry/${entryId}`);
      return response;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Lỗi khi xóa entry');
    }
  },

  // Lấy thống kê dinh dưỡng
  getNutritionStats: async (period = 7) => {
    try {
      const response = await axiosClient.get(`/food-diary/stats?period=${period}`);
      return response;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Lỗi khi lấy thống kê dinh dưỡng');
    }
  },

  // Lấy thực phẩm phổ biến
  getPopularFoods: async (limit = 10) => {
    try {
      const response = await axiosClient.get(`/food-diary/popular?limit=${limit}`);
      return response;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Lỗi khi lấy thực phẩm phổ biến');
    }
  }
};

export default foodDiaryService; 