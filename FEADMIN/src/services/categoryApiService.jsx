import axios from 'axios'; // Cài đặt: npm install axios

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'; // Lấy từ biến môi trường hoặc mặc định

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    // Có thể thêm header Authorization nếu API yêu cầu xác thực
    // 'Authorization': `Bearer ${getToken()}` // Ví dụ hàm lấy token
  },
});

// Xử lý lỗi tập trung (tùy chọn)
apiClient.interceptors.response.use(
  (response) => response.data, // Chỉ trả về phần data của response thành công
  (error) => {
    // Xử lý lỗi chung ở đây nếu muốn
    const message = error.response?.data?.message || error.message || 'Có lỗi xảy ra từ server';
    console.error('API Error:', message);
    // Ném lại lỗi với message đã được chuẩn hóa
    return Promise.reject(new Error(message));
  }
);

const getAllCategories = async () => {
  // API trả về { success: true, data: [...] } nên cần lấy .data
  const response = await apiClient.get('/categories');
  if (response.success) {
      return response.data;
  } else {
      throw new Error(response.message || 'Không thể lấy danh sách categories');
  }
};

const getCategoryById = async (id) => {
  const response = await apiClient.get(`/categories/${id}`);
   if (response.success) {
      return response.data;
  } else {
      throw new Error(response.message || `Không thể lấy category ID ${id}`);
  }
};

const createCategory = async (categoryData) => {
  // Body API là { name: "..." }
  const response = await apiClient.post('/categories', categoryData);
   if (response.success) {
      return response.data;
  } else {
      throw new Error(response.message || 'Tạo category thất bại');
  }
};

const updateCategory = async (id, categoryData) => {
  // Body API là { name: "..." }
  const response = await apiClient.put(`/categories/${id}`, categoryData);
   if (response.success) {
      return response.data;
  } else {
      throw new Error(response.message || `Cập nhật category ID ${id} thất bại`);
  }
};

const deleteCategory = async (id) => {
  const response = await apiClient.delete(`/categories/${id}`);
   // API xóa thành công có thể trả về success: true, message: "..."
   if (!response.success) {
       throw new Error(response.message || `Xóa category ID ${id} thất bại`);
   }
   // Không cần return gì cả khi xóa thành công
};

const categoryApiService = {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
};

export default categoryApiService;