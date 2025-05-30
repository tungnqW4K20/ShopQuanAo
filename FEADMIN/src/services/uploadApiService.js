import axios from 'axios';

let _getAuthTokenFunctionForUpload = () => null;

export const setUploadAuthTokenGetter = (getterFunction) => {
  _getAuthTokenFunctionForUpload = getterFunction;
};

const getTokenForUpload = () => {
  return _getAuthTokenFunctionForUpload();
};

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api/v1'; 
const UPLOAD_API_ENDPOINT = `${API_BASE_URL}/uploads`; 

const uploadApiClient = axios.create({
  baseURL: UPLOAD_API_ENDPOINT, 
});

uploadApiClient.interceptors.request.use(
  (config) => {
    const token = getTokenForUpload();
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

uploadApiClient.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    let errorMessage = 'Lỗi khi tải tệp lên.';
    if (error.response) {
      console.error('Upload API Response Error:', error.response.status, error.response.data);
      errorMessage = error.response.data?.message || error.response.statusText || errorMessage;
      if (error.response.status === 401) {
        errorMessage = error.response.data?.message || 'Phiên đăng nhập không hợp lệ hoặc đã hết hạn để tải lên.';
      } else if (error.response.status === 413) {
        errorMessage = error.response.data?.message || 'Kích thước một hoặc nhiều tệp quá lớn.';
      }
    } else if (error.request) {
      console.error('Upload API No Response Error:', error.request);
      errorMessage = 'Không nhận được phản hồi từ máy chủ khi tải tệp lên.';
    } else {
      console.error('Upload API Request Setup Error:', error.message);
      errorMessage = error.message || 'Lỗi khi gửi yêu cầu tải tệp lên.';
    }

    const customError = new Error(errorMessage);
    if (error.response) {
        customError.status = error.response.status;
    }
    return Promise.reject(customError);
  }
);

const uploadProductImage = async (file) => {
  const formData = new FormData();
  formData.append('productImage', file); 

  try {
   
    const response = await uploadApiClient.post(`/product-image`, formData);
    if (response && response.success && response.data && response.data.imageUrl) {
      return response.data.imageUrl;
    } else {
      throw new Error(response?.message || 'Không thể lấy URL ảnh sau khi tải lên. Phản hồi không hợp lệ.');
    }
  } catch (error) {
    throw error;
  }
};

const uploadMultipleProductImages = async (files) => {
  if (!files || files.length === 0) {
    return [];
  }
  const formData = new FormData();
  
  files.forEach(file => {
    formData.append('productImages', file);
  });

  try {
    
    const response = await uploadApiClient.post(`/product-multi-images`, formData);
    if (response && response.success && response.data && Array.isArray(response.data.imageUrls)) {
      return response.data.imageUrls;
    } else {
      throw new Error(response?.message || 'Không thể lấy danh sách URL ảnh sau khi tải lên. Phản hồi không hợp lệ.');
    }
  } catch (error) {
    throw error;
  }
};

const uploadApiService = {
  uploadProductImage,
  uploadMultipleProductImages,
};

export default uploadApiService;