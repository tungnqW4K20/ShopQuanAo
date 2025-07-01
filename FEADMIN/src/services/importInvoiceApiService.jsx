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

const importInvoiceApiService = {
  getImportInvoices,
  getImportInvoiceById,
  completeImportInvoice,
};

export default importInvoiceApiService;