import request from './apiService';

const API_ENDPOINT = '/categories';

const getAllCategories = async () => {
  const response = await request({ method: 'get', url: API_ENDPOINT });
  
  if (response && response.success) {
    return response.data;
  } else {
    throw new Error(response?.message || 'Không thể lấy danh sách danh mục từ API.');
  }
};


const getCategoryById = async (id) => {
  const response = await request({ method: 'get', url: `${API_ENDPOINT}/${id}` });
  if (response && response.success) {
    return response.data;
  } else {
    throw new Error(response?.message || `Không thể lấy danh mục ID ${id} từ API.`);
  }
};


const createCategory = async (categoryData) => {
  const response = await request({ method: 'post', url: API_ENDPOINT, data: categoryData });
  if (response && response.success) {
    return response.data;
  } else {
    throw new Error(response?.message || 'Tạo danh mục thất bại.');
  }
};

const updateCategory = async (id, categoryData) => {
  const response = await request({ method: 'put', url: `${API_ENDPOINT}/${id}`, data: categoryData });
  if (response && response.success) {
    return response.data; // Trả về category vừa cập nhật
  } else {
    throw new Error(response?.message || `Cập nhật danh mục ID ${id} thất bại.`);
  }
};

const deleteCategory = async (id) => {
  const response = await request({ method: 'delete', url: `${API_ENDPOINT}/${id}` });
  // API xóa thành công có thể chỉ trả về { success: true, message: "..." }
  if (response && response.success) {
    // Không cần return data cụ thể khi xóa thành công, chỉ cần không có lỗi
    return; 
  } else {
    throw new Error(response?.message || `Xóa danh mục ID ${id} thất bại.`);
  }
};

const categoryApiService = {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
};

export default categoryApiService;