// src/services/customerApiService.js
import request from './apiService'; // Assuming apiService.js is in the same directory

const API_ENDPOINT = '/customers';

const getAllCustomers = async () => {
  const response = await request({ method: 'get', url: API_ENDPOINT });
  if (response && response.success) {
    return response.data; // Assuming API returns { success: true, data: [...] }
  } else {
    throw new Error(response?.message || 'Không thể lấy danh sách khách hàng từ API.');
  }
};

const getCustomerById = async (id) => {
  const response = await request({ method: 'get', url: `${API_ENDPOINT}/${id}` });
  if (response && response.success) {
    return response.data; // Assuming API returns { success: true, data: {...} }
  } else {
    throw new Error(response?.message || `Không thể lấy thông tin khách hàng ID ${id} từ API.`);
  }
};

const createCustomer = async (customerData) => {
  // The example request includes 'password', ensure it's handled here
  const response = await request({ method: 'post', url: API_ENDPOINT, data: customerData });
  if (response && response.success) {
    return response.data; // Assuming API returns { success: true, data: {...createdCustomer} }
  } else {
    throw new Error(response?.message || 'Tạo khách hàng thất bại.');
  }
};

const updateCustomer = async (id, customerData) => {
  const response = await request({ method: 'put', url: `${API_ENDPOINT}/${id}`, data: customerData });
  if (response && response.success) {
    return response.data; 
  } else {
    throw new Error(response?.message || `Cập nhật khách hàng ID ${id} thất bại.`);
  }
};

const deleteCustomer = async (id) => {
  const response = await request({ method: 'delete', url: `${API_ENDPOINT}/${id}` });
  if (response && response.success) {
    return;
  } else {
    throw new Error(response?.message || `Xóa khách hàng ID ${id} thất bại.`);
  }
};

const customerApiService = {
  getAllCustomers,
  getCustomerById,
  createCustomer,
  updateCustomer,
  deleteCustomer,
};

export default customerApiService;