import axiosClient from './axiosClient';

const addressService = {
  // Lấy tất cả địa chỉ
  getAllAddresses: async () => {
    try {
      const response = await axiosClient.get('/address');
      return response;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Lỗi khi lấy danh sách địa chỉ');
    }
  },

  // Tạo địa chỉ mới
  createAddress: async (addressData) => {
    try {
      const response = await axiosClient.post('/address', addressData);
      return response;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Lỗi khi thêm địa chỉ');
    }
  },

  // Cập nhật địa chỉ
  updateAddress: async (id, addressData) => {
    try {
      const response = await axiosClient.put(`/address/${id}`, addressData);
      return response;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Lỗi khi cập nhật địa chỉ');
    }
  },

  // Xóa địa chỉ
  deleteAddress: async (id) => {
    try {
      const response = await axiosClient.delete(`/address/${id}`);
      return response;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Lỗi khi xóa địa chỉ');
    }
  },

  // Đặt địa chỉ mặc định
  setDefaultAddress: async (id) => {
    try {
      const response = await axiosClient.put(`/address/${id}/default`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Lỗi khi đặt địa chỉ mặc định');
    }
  }
};

export default addressService; 