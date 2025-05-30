// src/services/uploadApiService.js
import axios from 'axios';

let _getAuthTokenFunctionForUpload = () => null;

export const setUploadAuthTokenGetter = (getterFunction) => {
  _getAuthTokenFunctionForUpload = getterFunction;
};

const getTokenForUpload = () => {
  return _getAuthTokenFunctionForUpload();
};

// VITE_API_URL thường là http://localhost:PORT/api/v1 (ví dụ)
// UPLOAD_ENDPOINT thường là /uploads (không có /api)
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api/v1'; // Giả sử API của bạn có prefix /api/v1
const UPLOAD_API_ENDPOINT = `${API_BASE_URL}/uploads`; // Endpoint cụ thể cho upload

const uploadApiClient = axios.create({
  baseURL: UPLOAD_API_ENDPOINT, // baseURL bây giờ trỏ thẳng đến /api/v1/uploads
});

uploadApiClient.interceptors.request.use(
  (config) => {
    const token = getTokenForUpload();
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    // Khi gửi FormData, axios tự đặt Content-Type.
    // Không cần đặt thủ công 'multipart/form-data' ở đây.
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
  formData.append('productImage', file); // Key backend: productImage

  try {
    // URL sẽ là UPLOAD_API_ENDPOINT + /product-image
    // Ví dụ: http://localhost:3001/api/v1/uploads/product-image
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
  // Backend mong đợi key là 'productImages' cho upload nhiều file
  // như đã định nghĩa trong router: uploadMiddleware.array('productImages', 10)
  files.forEach(file => {
    formData.append('productImages', file);
  });

  try {
    // URL sẽ là UPLOAD_API_ENDPOINT + /product-images
    // Ví dụ: http://localhost:3001/api/v1/uploads/product-images
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