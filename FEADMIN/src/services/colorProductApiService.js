// src/services/colorProductApiService.js
import request from './apiService'; // Assuming apiService.js is in the same directory

const API_BASE_ENDPOINT = '/color-products'; // Matches your backend routes

// Fetches all color variants for a specific product ID
const getAllColorProductsByProductId = async (productId) => {
  const response = await request({
    method: 'get',
    url: `${API_BASE_ENDPOINT}/product/${productId}`,
  });
  if (response && response.success) {
    return response.data;
  } else {
    throw new Error(response?.message || `Không thể lấy danh sách biến thể màu cho sản phẩm ID ${productId}.`);
  }
};

// Fetches all color variants (including soft-deleted) for a specific product ID
const getAllColorProductsByProductIdIncludingDeleted = async (productId) => {
  const response = await request({
    method: 'get',
    url: `${API_BASE_ENDPOINT}/product/${productId}/all`, // Make sure this route exists on backend
  });
  if (response && response.success) {
    return response.data;
  } else {
    throw new Error(response?.message || `Không thể lấy tất cả biến thể màu (kể cả đã xóa) cho sản phẩm ID ${productId}.`);
  }
};


const getColorProductById = async (colorProductId) => {
  const response = await request({
    method: 'get',
    url: `${API_BASE_ENDPOINT}/${colorProductId}`,
  });
  if (response && response.success) {
    return response.data;
  } else {
    throw new Error(response?.message || `Không thể lấy biến thể màu ID ${colorProductId}.`);
  }
};

const createColorProduct = async (colorProductData) => {
  // product_id should be part of colorProductData
  const response = await request({
    method: 'post',
    url: API_BASE_ENDPOINT,
    data: colorProductData,
  });
  if (response && response.success) {
    return response.data;
  } else {
    throw new Error(response?.message || 'Tạo biến thể màu thất bại.');
  }
};

const updateColorProduct = async (colorProductId, colorProductData) => {
  const response = await request({
    method: 'put',
    url: `${API_BASE_ENDPOINT}/${colorProductId}`,
    data: colorProductData,
  });
  if (response && response.success) {
    return response.data;
  } else {
    throw new Error(response?.message || `Cập nhật biến thể màu ID ${colorProductId} thất bại.`);
  }
};

const softDeleteColorProduct = async (colorProductId) => {
  const response = await request({
    method: 'patch', // Matches backend route
    url: `${API_BASE_ENDPOINT}/${colorProductId}/soft-delete`,
  });
  if (response && response.success) {
    return;
  } else {
    throw new Error(response?.message || `Xóa mềm biến thể màu ID ${colorProductId} thất bại.`);
  }
};

const hardDeleteColorProduct = async (colorProductId) => {
  const response = await request({
    method: 'delete',
    url: `${API_BASE_ENDPOINT}/${colorProductId}`,
  });
  if (response && response.success) {
    return;
  } else {
    throw new Error(response?.message || `Xóa vĩnh viễn biến thể màu ID ${colorProductId} thất bại.`);
  }
};

const restoreColorProduct = async (colorProductId) => {
  const response = await request({
    method: 'post',
    url: `${API_BASE_ENDPOINT}/${colorProductId}/restore`,
  });
  if (response && response.success) {
    return response.data;
  } else {
    throw new Error(response?.message || `Khôi phục biến thể màu ID ${colorProductId} thất bại.`);
  }
};

const colorProductApiService = {
  getAllColorProductsByProductId,
  getAllColorProductsByProductIdIncludingDeleted,
  getColorProductById,
  createColorProduct,
  updateColorProduct,
  softDeleteColorProduct,
  hardDeleteColorProduct,
  restoreColorProduct,
};

export default colorProductApiService;