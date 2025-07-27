import axiosClient from './axiosClient';

const foodService = {
  // Lấy tất cả thực phẩm
  getAllFoods: async (params = {}) => {
    try {
      const { page = 1, limit = 20, search, category } = params;
      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString()
      });
      
      if (search) queryParams.append('search', search);
      if (category && category !== 'all') queryParams.append('category', category);

      const response = await axiosClient.get(/food?${queryParams});
      return response;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Lỗi khi lấy danh sách thực phẩm');
    }
  },

  // Tìm kiếm thực phẩm
  searchFoods: async (query, limit = 10) => {
    try {
      const response = await axiosClient.get(/food/search?q=${encodeURIComponent(query)}&limit=${limit});
      return response;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Lỗi khi tìm kiếm thực phẩm');
    }
  },

  // Lấy thông tin một thực phẩm
  getFoodById: async (id) => {
    try {
      const response = await axiosClient.get(/food/${id});
      return response;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Lỗi khi lấy thông tin thực phẩm');
    }
  },

  // Lấy danh sách categories
  getCategories: async () => {
    try {
      const response = await axiosClient.get('/food/categories');
      return response;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Lỗi khi lấy danh sách categories');
    }
  },

  // Tạo thực phẩm mới (admin)
  createFood: async (foodData) => {
    try {
      const response = await axiosClient.post('/food', foodData);
      return response;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Lỗi khi tạo thực phẩm');
    }
  },

  // Cập nhật thực phẩm (admin)
  updateFood: async (id, foodData) => {
    try {
      const response = await axiosClient.put(/food/${id}, foodData);
      return response;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Lỗi khi cập nhật thực phẩm');
    }
  },

  // Xóa thực phẩm (admin)
  deleteFood: async (id) => {
    try {
      const response = await axiosClient.delete(/food/${id});
      return response;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Lỗi khi xóa thực phẩm');
    }
  }
};

export default foodService; 