// src/services/importInvoiceApiService.js
import request from './apiService';

const API_ENDPOINT = '/imports';

const getImportInvoices = async (params) => {
  const response = await request({
    method: 'get',
    url: API_ENDPOINT,
    params,
  });
  if (response && response.success) {
    return response.data;
  }
  throw new Error(response?.message || 'Không thể tải danh sách hóa đơn nhập.');
};

const getImportInvoiceById = async (invoiceId) => {
  const response = await request({
    method: 'get',
    url: `${API_ENDPOINT}/${invoiceId}`,
  });
  if (response && response.success) {
    return response.data;
  }
  throw new Error(response?.message || `Không thể tải chi tiết hóa đơn #${invoiceId}.`);
};

const completeImportInvoice = async (invoiceId) => {
  const response = await request({
    method: 'put',
    url: `${API_ENDPOINT}/${invoiceId}/complete`,
  });
  if (response && response.success) {
    return response;
  }
  throw new Error(response?.message || `Hoàn thành hóa đơn #${invoiceId} thất bại.`);
};

// **HÀM MỚI ĐÃ ĐƯỢC THÊM VÀO ĐÂY**
const createImportInvoice = async (invoiceData) => {
  const response = await request({
    method: 'post',
    url: API_ENDPOINT,
    data: invoiceData,
  });
  // Dựa trên response mẫu, API trả về `success: true` ở cấp cao nhất
  if (response && response.success) {
    return response.data; // Trả về phần data chứa thông tin hóa đơn vừa tạo
  }
  // Nếu không thành công, ném lỗi với message từ API hoặc một message mặc định
  throw new Error(response?.message || 'Tạo hóa đơn nhập thất bại.');
};

const importInvoiceApiService = {
  getImportInvoices,
  getImportInvoiceById,
  completeImportInvoice,
  createImportInvoice, // **Thêm vào export**
};

export default importInvoiceApiService;