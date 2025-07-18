import axiosClient from './axiosClient';

const mealSuggestionService = {
  // Lấy tất cả gợi ý món ăn
  getAllMealSuggestions: async (params = {}) => {
    try {
      const { 
        page = 1, 
        limit = 12, 
        mealType, 
        goal, 
        tags, 
        maxCalories, 
        minCalories,
        search,
        featured 
      } = params;
      
      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString()
      });
      
      if (mealType && mealType !== 'all') queryParams.append('mealType', mealType);
      if (goal && goal !== 'all') queryParams.append('goal', goal);
      if (tags) queryParams.append('tags', tags);
      if (maxCalories) queryParams.append('maxCalories', maxCalories);
      if (minCalories) queryParams.append('minCalories', minCalories);
      if (search) queryParams.append('search', search);
      if (featured) queryParams.append('featured', featured);

      const response = await axiosClient.get(`/meal-suggestions?${queryParams}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Lỗi khi lấy gợi ý món ăn');
    }
  },

  // Lấy thông tin chi tiết một món ăn
  getMealSuggestionById: async (id) => {
    try {
      const response = await axiosClient.get(`/meal-suggestions/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Lỗi khi lấy thông tin món ăn');
    }
  },

  // Lấy gợi ý món ăn theo mục tiêu calo
  getMealSuggestionsByCalories: async (targetCalories, mealType = 'all', limit = 6) => {
    try {
      const queryParams = new URLSearchParams({
        targetCalories: targetCalories.toString(),
        mealType,
        limit: limit.toString()
      });

      const response = await axiosClient.get(`/meal-suggestions/by-calories?${queryParams}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Lỗi khi lấy gợi ý món ăn theo calo');
    }
  },

  // Tìm kiếm món ăn
  searchMealSuggestions: async (query, limit = 10) => {
    try {
      const response = await axiosClient.get(`/meal-suggestions/search?q=${encodeURIComponent(query)}&limit=${limit}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Lỗi khi tìm kiếm món ăn');
    }
  },

  // Lấy món ăn phổ biến
  getPopularMealSuggestions: async (limit = 6) => {
    try {
      const response = await axiosClient.get(`/meal-suggestions/popular?limit=${limit}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Lỗi khi lấy món ăn phổ biến');
    }
  },

  // Tạo gợi ý món ăn mới
  createMealSuggestion: async (data) => {
    try {
      const response = await axiosClient.post('/meal-suggestions', data);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Lỗi khi tạo gợi ý món ăn');
    }
  },

  // Cập nhật gợi ý món ăn
  updateMealSuggestion: async (id, data) => {
    try {
      const response = await axiosClient.put(`/meal-suggestions/${id}`, data);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Lỗi khi cập nhật gợi ý món ăn');
    }
  },

  // Xóa gợi ý món ăn
  deleteMealSuggestion: async (id) => {
    try {
      const response = await axiosClient.delete(`/meal-suggestions/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Lỗi khi xóa gợi ý món ăn');
    }
  },

  // Like/Unlike món ăn
  toggleLikeMealSuggestion: async (id, action) => {
    try {
      const response = await axiosClient.post(`/meal-suggestions/${id}/like`, { action });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Lỗi khi thích/bỏ thích món ăn');
    }
  }
};

export default mealSuggestionService; 