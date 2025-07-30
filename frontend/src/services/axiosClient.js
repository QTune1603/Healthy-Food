import axios from 'axios';

// Tạo axios instance
const axiosClient = axios.create({
  baseURL: 'http://localhost:5000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor để thêm token vào header
axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    //Bắt đầu đo thời gian API
    config.metadata = { startTime: new Date() };
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor để xử lý response và error
axiosClient.interceptors.response.use(
  (response) => {
    //Tính thời gian phản hồi
    if(response.config.metadata) {
      const duration = new Date() - response.config.metadata.startTime;
      logApiPerformance(response.config.method, response.config.url, duration)
    }

    return response.data;
  },
  (error) => {
    //Tính tgian neus request thất bại
    if(error.config?.metadata){
      const duration = new Date() - error.config.metadata.startTime;
      logApiPerformance(error.config.method, error.config.url, duration, true);
    }
    const message = error.response?.data?.message || error.message || 'Có lỗi xảy ra';
    
    // Nếu token hết hạn, xóa token và redirect về login
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    
    return Promise.reject(new Error(message));
  }
);

//Hàm log hiệu suất API
function logApiPerformance(method, url, duration, isError = false) {
  const color = duration > 500
    ? 'color:red;'
    : duration > 300
    ? 'color:orange;'
    : 'color:green;';

  console.log(`%c${isError ? '❌' : '✅'} [${method?.toUpperCase()}] ${url} - ${duration}ms`, color);
  }

export default axiosClient; 