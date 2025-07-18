import axiosClient from './axiosClient';

const blogService = {
  // Lấy tất cả bài viết với filters
  getAllPosts: async (params = {}) => {
    try {
      const queryString = new URLSearchParams(params).toString();
      const url = queryString ? `/blog?${queryString}` : '/blog';
      const response = await axiosClient.get(url);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Lấy bài viết theo ID
  getPostById: async (id) => {
    try {
      const response = await axiosClient.get(`/blog/${id}`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Lấy bài viết nổi bật
  getFeaturedPosts: async () => {
    try {
      const response = await axiosClient.get('/blog/featured');
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Tạo bài viết mới (yêu cầu authentication)
  createPost: async (postData) => {
    try {
      const response = await axiosClient.post('/blog', postData);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Cập nhật bài viết (yêu cầu authentication)
  updatePost: async (id, postData) => {
    try {
      const response = await axiosClient.put(`/blog/${id}`, postData);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Xóa bài viết (yêu cầu authentication)
  deletePost: async (id) => {
    try {
      const response = await axiosClient.delete(`/blog/${id}`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Like/Unlike bài viết (yêu cầu authentication)
  toggleLike: async (id) => {
    try {
      const response = await axiosClient.put(`/blog/${id}/like`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Tìm kiếm bài viết
  searchPosts: async (searchTerm, filters = {}) => {
    try {
      const params = {
        search: searchTerm,
        ...filters
      };
      return await blogService.getAllPosts(params);
    } catch (error) {
      throw error;
    }
  },

  // Lấy bài viết theo category
  getPostsByCategory: async (category, parentCategory = null) => {
    try {
      const params = { category };
      if (parentCategory) {
        params.parentCategory = parentCategory;
      }
      return await blogService.getAllPosts(params);
    } catch (error) {
      throw error;
    }
  },

  // Lấy bài viết với pagination
  getPostsWithPagination: async (page = 1, limit = 10, filters = {}) => {
    try {
      const params = {
        page,
        limit,
        ...filters
      };
      return await blogService.getAllPosts(params);
    } catch (error) {
      throw error;
    }
  }
};

export default blogService; 