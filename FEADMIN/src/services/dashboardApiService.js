// src/services/dashboardApiService.js
import request from './apiService';

// Lấy tất cả đơn hàng (cho admin)
const getAllOrders = async () => {
  const response = await request({
    method: 'get',
    url: '/orders/admin/all',
  });
  if (response && response.success) {
    return response.data;
  }
  throw new Error(response?.message || 'Không thể tải danh sách đơn hàng.');
};



// Lấy tất cả khách hàng
const getAllCustomers = async () => {
  const response = await request({
    method: 'get',
    url: '/customers',
  });
  if (response && response.success) {
    return response.data;
  }
  throw new Error(response?.message || 'Không thể tải danh sách khách hàng.');
};

const dashboardApiService = {
  getAllOrders,
  getAllCustomers,
};

export default dashboardApiService;

