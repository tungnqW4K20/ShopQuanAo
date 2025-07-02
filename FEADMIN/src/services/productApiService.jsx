// src/services/productApiService.js
import request from './apiService'; // Assuming apiService.js is in the same directory or adjust path

const API_ENDPOINT = '/products';

const getAllProducts = async (/*queryParams = {}*/) => {
  // const params = {};
  // if (queryParams.page) params.page = queryParams.page;
  // if (queryParams.limit) params.limit = queryParams.limit;
  // if (queryParams.search) params.search = queryParams.search;
  // if (queryParams.categoryId) params.categoryId = queryParams.categoryId;

  const response = await request({ method: 'get', url: API_ENDPOINT /*, params*/ });
  if (response && response.success) {
    return response.data; // The API returns { success: true, data: [products], pagination: {...} }
                          // The apiService returns the backend's 'data' field.
                          // So, response.data here IS the array of products.
  } else {
    throw new Error(response?.message || 'Không thể lấy danh sách sản phẩm từ API.');
  }
};

const getProductById = async (id) => {
  const response = await request({ method: 'get', url: `${API_ENDPOINT}/${id}` });
  if (response && response.success) {
    return response.data;
  } else {
    throw new Error(response?.message || `Không thể lấy sản phẩm ID ${id} từ API.`);
  }
};

const createProduct = async (productData) => {
  const response = await request({ method: 'post', url: API_ENDPOINT, data: productData });
  if (response && response.success) {
    return response.data;
  } else {
    throw new Error(response?.message || 'Tạo sản phẩm thất bại.');
  }
};

const updateProduct = async (id, productData) => {
  const response = await request({ method: 'put', url: `${API_ENDPOINT}/${id}`, data: productData });
  if (response && response.success) {
    return response.data;
  } else {
    throw new Error(response?.message || `Cập nhật sản phẩm ID ${id} thất bại.`);
  }
};

const deleteProduct = async (id) => {
  const response = await request({ method: 'delete', url: `${API_ENDPOINT}/${id}` });
  if (response && response.success) {
    return; // Delete successful
  } else {
    throw new Error(response?.message || `Xóa sản phẩm ID ${id} thất bại.`);
  }
};

const getProductVariants = async (productId) => {
  const response = await request({ method: 'get', url: `${API_ENDPOINT}/${productId}/variants` });
  if (response && response.success) {
    return response.data; // Should return { colors: [...], sizes: [...] }
  } else {
    throw new Error(response?.message || `Không thể lấy biến thể cho sản phẩm ID ${productId}.`);
  }
};

const productApiService = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductVariants
};

export default productApiService;