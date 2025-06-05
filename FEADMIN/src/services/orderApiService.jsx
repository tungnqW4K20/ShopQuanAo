import request from './apiService';

const API_ENDPOINT = '/orders/admin';


const getAllOrders = async (params) => {
  const response = await request({
    method: 'get',
    url: `${API_ENDPOINT}/all`,
    params, 
  });
  if (response && response.success) {
    return response; 
  } else {
    throw new Error(response?.message || 'Không thể tải danh sách đơn hàng từ API.');
  }
};


const updateOrderStatus = async (orderId, statusApiKey) => {
  const response = await request({
    method: 'patch',
    url: `${API_ENDPOINT}/orders/${orderId}/status`,
    data: { status: statusApiKey },
  });
  if (response && response.success) {
    return response.data; 
  } else {
    throw new Error(response?.message || `Cập nhật trạng thái đơn hàng ID ${orderId} thất bại.`);
  }
};

const getOrderStatuses = async () => {
  const response = await request({ method: 'get', url: `${API_ENDPOINT}/statuses` });
  if (response && response.success) {
    return response.data; 
  } else {
    throw new Error(response?.message || 'Không thể tải danh sách trạng thái đơn hàng từ API.');
  }
};

const orderApiService = {
  getAllOrders,
  updateOrderStatus,
  getOrderStatuses,
};

export default orderApiService;