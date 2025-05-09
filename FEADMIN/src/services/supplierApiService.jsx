// src/services/supplierApiService.js
import request from './apiService'; // Assuming your generic request function is here

const API_ENDPOINT = '/suppliers';

const getAllSuppliers = async () => {
  const response = await request({ method: 'get', url: API_ENDPOINT });
  if (response && response.success) {
    return response.data;
  } else {
    throw new Error(response?.message || 'Không thể tải danh sách nhà cung cấp từ API.');
  }
};

const getSupplierById = async (id) => {
  const response = await request({ method: 'get', url: `${API_ENDPOINT}/${id}` });
  if (response && response.success) {
    return response.data;
  } else {
    throw new Error(response?.message || `Không thể lấy nhà cung cấp ID ${id} từ API.`);
  }
};

const createSupplier = async (supplierData) => {
  const response = await request({ method: 'post', url: API_ENDPOINT, data: supplierData });
  if (response && response.success) {
    return response.data;
  } else {
    // Try to parse backend validation errors if available
    if (response && response.errors && Array.isArray(response.errors)) {
        const errorMessages = response.errors.map(err => err.message || err.msg).join(', ');
        throw new Error(errorMessages || 'Tạo nhà cung cấp thất bại.');
    }
    throw new Error(response?.message || 'Tạo nhà cung cấp thất bại.');
  }
};

const updateSupplier = async (id, supplierData) => {
  const response = await request({ method: 'put', url: `${API_ENDPOINT}/${id}`, data: supplierData });
  if (response && response.success) {
    return response.data; 
  } else {
    if (response && response.errors && Array.isArray(response.errors)) {
        const errorMessages = response.errors.map(err => err.message || err.msg).join(', ');
        throw new Error(errorMessages || `Cập nhật nhà cung cấp ID ${id} thất bại.`);
    }
    throw new Error(response?.message || `Cập nhật nhà cung cấp ID ${id} thất bại.`);
  }
};

const deleteSupplier = async (id) => {
  const response = await request({ method: 'delete', url: `${API_ENDPOINT}/${id}` });
  if (response && response.success) {
    return; 
  } else {
    throw new Error(response?.message || `Xóa nhà cung cấp ID ${id} thất bại.`);
  }
};

const supplierApiService = {
  getAllSuppliers,
  getSupplierById,
  createSupplier,
  updateSupplier,
  deleteSupplier,
};

export default supplierApiService;