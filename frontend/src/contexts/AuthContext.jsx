import { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      if (authService.isAuthenticated()) {
        // Lấy user từ localStorage trước
        const userFromStorage = authService.getUserFromStorage();
        if (userFromStorage) {
          setUser(userFromStorage);
          setLoading(false); // Set loading false ngay khi có user từ localStorage
        }
        
        // Sau đó verify với server (optional)
        try {
          const response = await authService.getCurrentUser();
          if (response.success) {
            setUser(response.data);
          }
        } catch (error) {
          // Nếu verify thất bại, vẫn giữ user từ localStorage
          console.log('Cannot verify with server, using cached user data');
        }
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      // Chỉ logout nếu có lỗi nghiêm trọng
      if (error.status === 401) {
        authService.logout();
      }
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials) => {
    try {
      const response = await authService.login(credentials);
      if (response.success) {
        // response.data chính là user object (bao gồm cả token)
        // Tách user info ra (loại bỏ token để set vào state)
        const { token, ...userInfo } = response.data;
        setUser(userInfo);
        console.log('AuthContext: User set to:', userInfo);
        return response;
      }
      return response;
    } catch (error) {
      throw error;
    }
  };

  const register = async (userData) => {
    try {
      const response = await authService.register(userData);
      if (response.success) {
        // Tương tự như login
        const { token, ...userInfo } = response.data;
        setUser(userInfo);
        return response;
      }
      return response;
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  const updateProfile = async (profileData) => {
    try {
      const response = await authService.updateProfile(profileData);
      if (response.success) {
        setUser(response.data);
        return response;
      }
      return response;
    } catch (error) {
      throw error;
    }
  };

  const changePassword = async (passwordData) => {
    try {
      const response = await authService.changePassword(passwordData);
      return response;
    } catch (error) {
      throw error;
    }
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    updateProfile,
    changePassword,
    isAuthenticated: !!user && authService.isAuthenticated()
  };

  // Debug log
  console.log('AuthContext state:', { user: !!user, loading, isAuthenticated: value.isAuthenticated });

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 