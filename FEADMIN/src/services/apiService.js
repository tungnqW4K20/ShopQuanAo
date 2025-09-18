import axios from 'axios';

//khai báo hàm thay vì khóa vì axios sẽ lưu token setup chứ ko phải  token cập nhật state nên phải gọi lại hàm để lấy
let _getAuthTokenFunction = () => null;


// đăng ký lấy token
export const setGlobalAuthTokenGetter = (getterFunction) => {
  _getAuthTokenFunction = getterFunction;
};

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://benodejs-9.onrender.com/api';

const getToken = () => {
  return _getAuthTokenFunction();
};



const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(
  (config) => {
    const token = getToken(); 
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    let errorMessage = 'Đã có lỗi xảy ra từ máy chủ.';
    let shouldLogout = false;

    if (error.response) {
      console.error('API Response Error:', error.response.status, error.response.data);
      errorMessage = error.response.data?.message || error.response.statusText || errorMessage;

      if (error.response.status === 401) {
        errorMessage = error.response.data?.message || 'Phiên đăng nhập không hợp lệ hoặc đã hết hạn.';
        shouldLogout = true; 
      } else if (error.response.status === 403) {
        errorMessage = error.response.data?.message || 'Bạn không có quyền thực hiện hành động này.';
      }
    } else if (error.request) {
      console.error('API No Response Error:', error.request);
      errorMessage = 'Không nhận được phản hồi từ máy chủ. Vui lòng kiểm tra kết nối mạng.';
    } else {
      console.error('API Request Setup Error:', error.message);
      errorMessage = error.message || 'Lỗi khi gửi yêu cầu đến máy chủ.';
    }

    const customError = new Error(errorMessage);
    customError.shouldLogout = shouldLogout; 
    if (error.response) {
        customError.status = error.response.status; 
    }
    return Promise.reject(customError);
  }
);

const request = async ({ method, url, data, params }) => {
  try {
    const response = await apiClient({
      method,
      url,
      data,
      params,
    });
    return response;
  } catch (error) {
    throw error;
  }
};

export default request;