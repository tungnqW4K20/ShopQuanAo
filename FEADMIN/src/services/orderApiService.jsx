// src/services/orderApiService.js
import request from './apiService'; // Giả sử apiService.js đã tồn tại và được cấu hình như mẫu

const API_ENDPOINT = '/orders';

// Lấy tất cả đơn hàng (ví dụ cho trang danh sách)
const getAllOrders = async (params) => { // params có thể chứa limit, offset, status, customerId
  const response = await request({ method: 'get', url: API_ENDPOINT, params });
  if (response && response.success) {
    return response.data; // API trả về { count, rows }
  } else {
    throw new Error(response?.message || 'Không thể lấy danh sách đơn hàng.');
  }
};

// Lấy một đơn hàng cụ thể bằng ID
const getOrderById = async (id) => {
  const response = await request({ method: 'get', url: `${API_ENDPOINT}/${id}` });
  if (response && response.success) {
    return response.data; // API trả về đối tượng đơn hàng chi tiết
  } else {
    throw new Error(response?.message || `Không thể lấy chi tiết đơn hàng ID ${id}.`);
  }
};

// Tạo đơn hàng mới
const createOrder = async (orderData) => {
  const response = await request({ method: 'post', url: API_ENDPOINT, data: orderData });
  if (response && response.success) {
    return response.data;
  } else {
    throw new Error(response?.message || 'Tạo đơn hàng thất bại.');
  }
};

// Cập nhật trạng thái đơn hàng
const updateOrderStatus = async (id, statusData) => { // statusData là { status: 'new_status' }
  const response = await request({ method: 'put', url: `${API_ENDPOINT}/${id}/status`, data: statusData });
  if (response && response.success) {
    return response.data;
  } else {
    throw new Error(response?.message || `Cập nhật trạng thái đơn hàng ID ${id} thất bại.`);
  }
};

// Xóa đơn hàng (soft delete)
const deleteOrder = async (id) => {
  const response = await request({ method: 'delete', url: `${API_ENDPOINT}/${id}` });
  if (response && response.success) {
    return; // Không cần data cụ thể khi xóa
  } else {
    throw new Error(response?.message || `Xóa đơn hàng ID ${id} thất bại.`);
  }
};


const orderApiService = {
  getAllOrders,
  getOrderById,
  createOrder,
  updateOrderStatus,
  deleteOrder,
};

export default orderApiService;