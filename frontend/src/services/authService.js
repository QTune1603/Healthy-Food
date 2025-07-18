import axiosClient from './axiosClient';

const authService = {
  // Đăng ký tài khoản
  register: async (userData) => {
    try {
      const response = await axiosClient.post('/auth/register', userData);
      
      // Lưu token và thông tin user vào localStorage
      if (response.success && response.data.token) {
        const { token, ...userInfo } = response.data;
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(userInfo));
      }
      
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Đăng nhập
  login: async (credentials) => {
    try {
      const response = await axiosClient.post('/auth/login', credentials);
      
      // Lưu token và thông tin user vào localStorage
      if (response.success && response.data.token) {
        const { token, ...userInfo } = response.data;
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(userInfo));
      }
      
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Đăng xuất
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  },

  // Lấy thông tin user hiện tại
  getCurrentUser: async () => {
    try {
      const response = await axiosClient.get('/auth/me');
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Cập nhật thông tin user
  updateProfile: async (userData) => {
    try {
      const response = await axiosClient.put('/auth/profile', userData);
      
      // Cập nhật thông tin user trong localStorage
      if (response.success && response.data) {
        localStorage.setItem('user', JSON.stringify(response.data));
      }
      
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Đổi mật khẩu
  changePassword: async (passwordData) => {
    try {
      const response = await axiosClient.put('/auth/password', passwordData);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Kiểm tra xem user đã đăng nhập chưa
  isAuthenticated: () => {
    const token = localStorage.getItem('token');
    return !!token;
  },

  // Lấy thông tin user từ localStorage
  getUserFromStorage: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  // Lấy token từ localStorage
  getToken: () => {
    return localStorage.getItem('token');
  }
};

export default authService; 