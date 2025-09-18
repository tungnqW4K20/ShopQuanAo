import axios from 'axios'; // Cài đặt: npm install axios

const API_URL = import.meta.env.VITE_API_URL || 'https://benodejs-9.onrender.com/api'; // Lấy từ biến môi trường hoặc mặc định

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

const LoginAdmin = async (loginData) => {
    const response = await apiClient.post('/auth/login-admin', loginData);
    const result = response.data;
  
    if (response.status === 200) {
      return response.data;
    } else {
      throw new Error(response.message || 'Đăng nhập không thành công hoặc dữ liệu không hợp lệ.');
    }
  };
  
  const LoginApiService = {
    LoginAdmin,
  };
  
  export default LoginApiService;