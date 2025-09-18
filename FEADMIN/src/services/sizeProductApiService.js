// src/services/sizeProductApiService.js
import request from './apiService';

const API_BASE_ENDPOINT = '/size-products'; // Matches your backend routes

const getAllSizeProductsByProductId = async (productId) => {
  const response = await request({
    method: 'get',
    url: `${API_BASE_ENDPOINT}/product/${productId}`,
  });
  if (response && response.success) {
    return response.data;
  } else {
    throw new Error(response?.message || `Không thể lấy danh sách biến thể kích thước cho sản phẩm ID ${productId}.`);
  }
};

const getAllSizeProductsByProductIdIncludingDeleted = async (productId) => {
  const response = await request({
    method: 'get',
    url: `${API_BASE_ENDPOINT}/product/${productId}/all`,
  });
  if (response && response.success) {
    return response.data;
  } else {
    throw new Error(response?.message || `Không thể lấy tất cả biến thể kích thước (kể cả đã xóa) cho sản phẩm ID ${productId}.`);
  }
};

const getSizeProductById = async (sizeProductId) => {
  const response = await request({
    method: 'get',
    url: `${API_BASE_ENDPOINT}/${sizeProductId}`,
  });
  if (response && response.success) {
    return response.data;
  } else {
    throw new Error(response?.message || `Không thể lấy biến thể kích thước ID ${sizeProductId}.`);
  }
};

const createSizeProduct = async (sizeProductData) => {
  // product_id should be part of sizeProductData
  const response = await request({
    method: 'post',
    url: API_BASE_ENDPOINT,
    data: sizeProductData,
  });
  if (response && response.success) {
    return response.data;
  } else {
    throw new Error(response?.message || 'Tạo biến thể kích thước thất bại.');
  }
};

const updateSizeProduct = async (sizeProductId, sizeProductData) => {
  const response = await request({
    method: 'put',
    url: `${API_BASE_ENDPOINT}/${sizeProductId}`,
    data: sizeProductData,
  });
  if (response && response.success) {
    return response.data;
  } else {
    throw new Error(response?.message || `Cập nhật biến thể kích thước ID ${sizeProductId} thất bại.`);
  }
};

const softDeleteSizeProduct = async (sizeProductId) => {
  const response = await request({
    method: 'patch',
    url: `${API_BASE_ENDPOINT}/${sizeProductId}/soft-delete`,
  });
  if (response && response.success) {
    return;
  } else {
    throw new Error(response?.message || `Xóa mềm biến thể kích thước ID ${sizeProductId} thất bại.`);
  }
};

const hardDeleteSizeProduct = async (sizeProductId) => {
  const response = await request({
    method: 'delete',
    url: `${API_BASE_ENDPOINT}/${sizeProductId}`,
  });
  if (response && response.success) {
    return;
  } else {
    throw new Error(response?.message || `Xóa vĩnh viễn biến thể kích thước ID ${sizeProductId} thất bại.`);
  }
};

const restoreSizeProduct = async (sizeProductId) => {
  const response = await request({
    method: 'post',
    url: `${API_BASE_ENDPOINT}/${sizeProductId}/restore`,
  });
  if (response && response.success) {
    return response.data;
  } else {
    throw new Error(response?.message || `Khôi phục biến thể kích thước ID ${sizeProductId} thất bại.`);
  }
};

const sizeProductApiService = {
  getAllSizeProductsByProductId,
  getAllSizeProductsByProductIdIncludingDeleted,
  getSizeProductById,
  createSizeProduct,
  updateSizeProduct,
  softDeleteSizeProduct,
  hardDeleteSizeProduct,
  restoreSizeProduct,
};

export default sizeProductApiService;


