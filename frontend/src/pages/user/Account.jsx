import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { addressService } from '../../services';

const Account = () => {
  const { user, updateProfile, changePassword } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', content: '' });
  
  const [userData, setUserData] = useState({
    avatar: '',
    fullName: '',
    email: '',
    phone: '',
    gender: '',
    dateOfBirth: '',
    address: ''
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [addresses, setAddresses] = useState([]);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [addressData, setAddressData] = useState({
    fullName: '',
    phone: '',
    address: '',
    city: '',
    district: '',
    ward: '',
    isDefault: false
  });

  // Load user data khi component mount
  useEffect(() => {
    if (user) {
      setUserData({
        avatar: user.avatar || 'https://i.pravatar.cc/300',
        fullName: user.fullName || '',
        email: user.email || '',
        phone: user.phone || '',
        gender: user.gender || '',
        dateOfBirth: user.dateOfBirth ? user.dateOfBirth.split('T')[0] : '',
        address: user.address || ''
      });
    }
  }, [user]);

  // Load addresses khi chuyển tab
  useEffect(() => {
    if (activeTab === 'address') {
      loadAddresses();
    }
  }, [activeTab]);

  const tabs = [
    { 
      id: 'profile', 
      label: 'Hồ sơ',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
        </svg>
      )
    },
    { 
      id: 'address', 
      label: 'Địa chỉ',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
        </svg>
      )
    },
    { 
      id: 'password', 
      label: 'Đổi mật khẩu',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
        </svg>
      )
    }
  ];

  const loadAddresses = async () => {
    try {
      const response = await addressService.getAllAddresses();
      if (response.success) {
        setAddresses(response.data);
      }
    } catch (error) {
      setMessage({ type: 'error', content: error.message });
    }
  };

  const handleChange = (e) => {
    setUserData({
      ...userData,
      [e.target.name]: e.target.value
    });
  };

  const handlePasswordChange = (e) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value
    });
  };

  const handleAddressChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setAddressData({
      ...addressData,
      [e.target.name]: value
    });
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', content: '' });

    try {
      const response = await updateProfile(userData);
      if (response.success) {
        setMessage({ type: 'success', content: 'Cập nhật hồ sơ thành công!' });
      } else {
        setMessage({ type: 'error', content: response.message || 'Có lỗi xảy ra' });
      }
    } catch (error) {
      setMessage({ type: 'error', content: error.message });
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', content: '' });

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage({ type: 'error', content: 'Mật khẩu xác nhận không khớp!' });
      setLoading(false);
      return;
    }

    try {
      const response = await changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });
      
      if (response.success) {
        setMessage({ type: 'success', content: 'Đổi mật khẩu thành công!' });
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
      } else {
        setMessage({ type: 'error', content: response.message || 'Có lỗi xảy ra' });
      }
    } catch (error) {
      setMessage({ type: 'error', content: error.message });
    } finally {
      setLoading(false);
    }
  };

  const handleAddressSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', content: '' });

    try {
      let response;
      if (editingAddress) {
        response = await addressService.updateAddress(editingAddress._id, addressData);
      } else {
        response = await addressService.createAddress(addressData);
      }

      if (response.success) {
        setMessage({ type: 'success', content: response.message });
        setShowAddressModal(false);
        resetAddressForm();
        loadAddresses();
      } else {
        setMessage({ type: 'error', content: response.message || 'Có lỗi xảy ra' });
      }
    } catch (error) {
      setMessage({ type: 'error', content: error.message });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAddress = async (id) => {
    if (!confirm('Bạn có chắc chắn muốn xóa địa chỉ này?')) return;

    try {
      const response = await addressService.deleteAddress(id);
      if (response.success) {
        setMessage({ type: 'success', content: response.message });
        loadAddresses();
      }
    } catch (error) {
      setMessage({ type: 'error', content: error.message });
    }
  };

  const handleSetDefaultAddress = async (id) => {
    try {
      const response = await addressService.setDefaultAddress(id);
      if (response.success) {
        setMessage({ type: 'success', content: response.message });
        loadAddresses();
      }
    } catch (error) {
      setMessage({ type: 'error', content: error.message });
    }
  };

  const openAddressModal = (address = null) => {
    if (address) {
      setEditingAddress(address);
      setAddressData({
        fullName: address.fullName,
        phone: address.phone,
        address: address.address,
        city: address.city,
        district: address.district,
        ward: address.ward,
        isDefault: address.isDefault
      });
    } else {
      resetAddressForm();
    }
    setShowAddressModal(true);
  };

  const resetAddressForm = () => {
    setEditingAddress(null);
    setAddressData({
      fullName: '',
      phone: '',
      address: '',
      city: '',
      district: '',
      ward: '',
      isDefault: false
    });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUserData({
          ...userData,
          avatar: reader.result
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const renderMessage = () => {
    if (!message.content) return null;
    
    return (
      <div className={`mb-4 p-4 rounded-lg ${
        message.type === 'success' 
          ? 'bg-green-50 border border-green-200 text-green-700'
          : 'bg-red-50 border border-red-200 text-red-700'
      }`}>
        {message.content}
      </div>
    );
  };

  const renderProfileTab = () => (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="p-8"
    >
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-2xl font-semibold text-gray-900">Hồ sơ của tôi</h3>
        <span className="text-sm text-gray-500">Quản lý thông tin hồ sơ để bảo mật tài khoản</span>
      </div>
      
      <div className="flex flex-col items-center mb-12">
        <div className="relative group">
          <img
            src={userData.avatar || 'https://i.pravatar.cc/300'}
            alt="Profile"
            className="h-40 w-40 rounded-full object-cover ring-4 ring-white shadow-lg transition-transform group-hover:scale-105"
            loading="lazy"
          />
          <button
            onClick={() => document.getElementById('avatar-upload').click()}
            className="absolute bottom-2 right-2 bg-white rounded-full p-3 shadow-lg hover:bg-gray-50 transition-all duration-200 transform hover:scale-110"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-700">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z" />
            </svg>
          </button>
          <input
            id="avatar-upload"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageUpload}
          />
        </div>
      </div>

      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
          {renderMessage()}
          <form onSubmit={handleProfileSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Họ và tên
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={userData.fullName}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3C493F] focus:border-transparent transition-all duration-200"
                  placeholder="Nhập họ và tên của bạn"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={userData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3C493F] focus:border-transparent transition-all duration-200"
                  placeholder="example@email.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Số điện thoại
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={userData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3C493F] focus:border-transparent transition-all duration-200"
                  placeholder="Nhập số điện thoại"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Giới tính
                </label>
                <select
                  name="gender"
                  value={userData.gender}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3C493F] focus:border-transparent transition-all duration-200"
                >
                  <option value="">Chọn giới tính</option>
                  <option value="male">Nam</option>
                  <option value="female">Nữ</option>
                  <option value="other">Khác</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ngày sinh
                </label>
                <input
                  type="date"
                  name="dateOfBirth"
                  value={userData.dateOfBirth}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3C493F] focus:border-transparent transition-all duration-200"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Địa chỉ
                </label>
                <textarea
                  name="address"
                  value={userData.address}
                  onChange={handleChange}
                  rows="3"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3C493F] focus:border-transparent transition-all duration-200"
                  placeholder="Nhập địa chỉ của bạn"
                />
              </div>
            </div>

            <div className="pt-6">
              <button
                type="submit"
                disabled={loading}
                className="w-full md:w-auto px-8 py-3 bg-[#3C493F] text-white rounded-lg hover:bg-[#2a3329] focus:outline-none focus:ring-2 focus:ring-[#3C493F] focus:ring-offset-2 transition-all duration-200 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Đang lưu...
                  </div>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 3.75H6.912a2.25 2.25 0 00-2.15 1.588L2.35 13.177a2.25 2.25 0 00-.1.661V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18v-4.162c0-.224-.034-.447-.1-.661L19.24 5.338a2.25 2.25 0 00-2.15-1.588H15M2.25 13.5h3.86a2.25 2.25 0 012.012 1.244l.256.512a2.25 2.25 0 002.013 1.244h3.218a2.25 2.25 0 002.013-1.244l.256-.512a2.25 2.25 0 012.013-1.244h3.859M12 3v8.25m0 0l-3-3m3 3l3-3" />
                    </svg>
                    <span>Lưu thay đổi</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </motion.div>
  );

  const renderAddressTab = () => (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="p-8"
    >
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-2xl font-semibold text-gray-900">Sổ địa chỉ</h3>
        <button
          onClick={() => openAddressModal()}
          className="inline-flex items-center px-4 py-2 bg-[#3C493F] text-white rounded-lg hover:bg-[#2a3329] focus:outline-none focus:ring-2 focus:ring-[#3C493F] focus:ring-offset-2 transition-all duration-200"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Thêm địa chỉ mới
        </button>
      </div>

      {renderMessage()}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {addresses.map((address) => (
          <div key={address._id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow duration-200">
            <div className="flex justify-between items-start mb-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-semibold text-gray-900">{address.fullName}</h4>
                  {address.isDefault && (
                    <span className="px-2 py-1 bg-[#3C493F] text-white text-xs rounded-full">
                      Mặc định
                    </span>
                  )}
                </div>
                <p className="text-gray-600 text-sm">{address.phone}</p>
              </div>
              <div className="flex items-center space-x-2">
                <button 
                  onClick={() => openAddressModal(address)}
                  className="text-sm text-gray-600 hover:text-gray-900 transition-colors duration-200"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                  </svg>
                </button>
                {!address.isDefault && (
                  <button 
                    onClick={() => handleSetDefaultAddress(address._id)}
                    className="text-sm text-blue-600 hover:text-blue-800 transition-colors duration-200"
                    title="Đặt làm mặc định"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                    </svg>
                  </button>
                )}
                <button 
                  onClick={() => handleDeleteAddress(address._id)}
                  className="text-sm text-red-500 hover:text-red-600 transition-colors duration-200"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                  </svg>
                </button>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-400 mt-0.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
              </svg>
              <p className="text-gray-600 text-sm">
                {address.address}, {address.ward}, {address.district}, {address.city}
              </p>
            </div>
          </div>
        ))}
      </div>

      {addresses.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📍</div>
          <h3 className="text-xl font-medium text-gray-900 mb-2">
            Chưa có địa chỉ nào
          </h3>
          <p className="text-gray-600 mb-4">
            Thêm địa chỉ để quản lý thông tin giao hàng
          </p>
          <button
            onClick={() => openAddressModal()}
            className="inline-flex items-center px-4 py-2 bg-[#3C493F] text-white rounded-lg hover:bg-[#2a3329]"
          >
            Thêm địa chỉ đầu tiên
          </button>
        </div>
      )}

      {/* Address Modal */}
      {showAddressModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                {editingAddress ? 'Cập nhật địa chỉ' : 'Thêm địa chỉ mới'}
              </h3>
              <button
                onClick={() => setShowAddressModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleAddressSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Họ và tên
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={addressData.fullName}
                  onChange={handleAddressChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3C493F] focus:border-transparent"
                  placeholder="Nhập họ và tên"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Số điện thoại
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={addressData.phone}
                  onChange={handleAddressChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3C493F] focus:border-transparent"
                  placeholder="Nhập số điện thoại"
                />
              </div>

              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tỉnh/Thành phố
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={addressData.city}
                    onChange={handleAddressChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3C493F] focus:border-transparent"
                    placeholder="Ví dụ: TP.HCM"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Quận/Huyện
                  </label>
                  <input
                    type="text"
                    name="district"
                    value={addressData.district}
                    onChange={handleAddressChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3C493F] focus:border-transparent"
                    placeholder="Ví dụ: Quận 1"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phường/Xã
                  </label>
                  <input
                    type="text"
                    name="ward"
                    value={addressData.ward}
                    onChange={handleAddressChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3C493F] focus:border-transparent"
                    placeholder="Ví dụ: Phường Bến Nghé"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Địa chỉ cụ thể
                </label>
                <textarea
                  name="address"
                  value={addressData.address}
                  onChange={handleAddressChange}
                  required
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3C493F] focus:border-transparent"
                  placeholder="Số nhà, tên đường..."
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="isDefault"
                  checked={addressData.isDefault}
                  onChange={handleAddressChange}
                  className="h-4 w-4 text-[#3C493F] focus:ring-[#3C493F] border-gray-300 rounded"
                />
                <label className="ml-2 block text-sm text-gray-900">
                  Đặt làm địa chỉ mặc định
                </label>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddressModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 px-4 py-2 bg-[#3C493F] text-white rounded-lg hover:bg-[#2a3329] disabled:opacity-50"
                >
                  {loading ? 'Đang lưu...' : (editingAddress ? 'Cập nhật' : 'Thêm')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </motion.div>
  );

  const renderPasswordTab = () => (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="p-8"
    >
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-2xl font-semibold text-gray-900">Đổi mật khẩu</h3>
        <span className="text-sm text-gray-500">Để bảo mật tài khoản, vui lòng không chia sẻ mật khẩu cho người khác</span>
      </div>

      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
          {renderMessage()}
          <form onSubmit={handlePasswordSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mật khẩu hiện tại
              </label>
              <input
                type="password"
                name="currentPassword"
                value={passwordData.currentPassword}
                onChange={handlePasswordChange}
                required
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3C493F] focus:border-transparent transition-all duration-200"
                placeholder="Nhập mật khẩu hiện tại"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mật khẩu mới
              </label>
              <input
                type="password"
                name="newPassword"
                value={passwordData.newPassword}
                onChange={handlePasswordChange}
                required
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3C493F] focus:border-transparent transition-all duration-200"
                placeholder="Nhập mật khẩu mới"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Xác nhận mật khẩu mới
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={passwordData.confirmPassword}
                onChange={handlePasswordChange}
                required
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3C493F] focus:border-transparent transition-all duration-200"
                placeholder="Nhập lại mật khẩu mới"
              />
            </div>
            <div className="pt-6">
              <button
                type="submit"
                disabled={loading}
                className="w-full md:w-auto px-8 py-3 bg-[#3C493F] text-white rounded-lg hover:bg-[#2a3329] focus:outline-none focus:ring-2 focus:ring-[#3C493F] focus:ring-offset-2 transition-all duration-200 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Đang cập nhật...
                  </div>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                    </svg>
                    <span>Đổi mật khẩu</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </motion.div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'profile':
        return renderProfileTab();
      case 'address':
        return renderAddressTab();
      case 'password':
        return renderPasswordTab();
      default:
        return renderProfileTab();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Sidebar */}
            <div className="w-full md:w-64">
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center space-x-4 mb-6">
                  <img
                    src={userData.avatar || 'https://i.pravatar.cc/300'}
                    alt="Profile"
                    className="h-16 w-16 rounded-full object-cover ring-4 ring-[#3C493F]/10"
                    loading="lazy"
                  />
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">{userData.fullName || 'User'}</h2>
                    <p className="text-sm text-gray-500">Chỉnh sửa hồ sơ</p>
                  </div>
                </div>
                <nav className="space-y-2">
                  {tabs.map(tab => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center space-x-3 px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
                        activeTab === tab.id
                          ? 'bg-[#3C493F]/10 text-[#3C493F]'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      }`}
                    >
                      {tab.icon}
                      <span>{tab.label}</span>
                    </button>
                  ))}
                </nav>
              </div>
            </div>

            {/* Main Content */}
            <div className="flex-1">
              <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                {renderContent()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Account; 