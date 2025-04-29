// src/pages/admin/ManageCategories.js
import React, { useState, useEffect, useCallback } from 'react';
import categoryApiService from '../services/categoryApiService'; // Sẽ tạo ở bước 4
import CategoryTable from '../components/Category/CategoryTable'; // Sẽ tạo ở bước 5
import CategoryModal from '../components/Category/CategoryModal'; // Sẽ tạo ở bước 6
import ConfirmDeleteModal from '../components/Category/ConfirmDeleteModal'; // Sẽ tạo ở bước 7
import { toast, ToastContainer } from 'react-toastify'; // Để hiển thị thông báo
import 'react-toastify/dist/ReactToastify.css';
import { AiOutlinePlus } from 'react-icons/ai';

function ManageCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentCategory, setCurrentCategory] = useState(null); // null: Add mode, object: Edit mode
  const [categoryToDelete, setCategoryToDelete] = useState(null);

  // Hàm fetch dữ liệu
  const fetchCategories = useCallback(async () => {
    setLoading(true);
    setError(null); // Reset error trước khi fetch
    try {
      const data = await categoryApiService.getAllCategories();
      setCategories(data);
    } catch (err) {
      console.error("Fetch categories error:", err);
      setError(err.message || 'Không thể tải danh sách danh mục.');
      toast.error(err.message || 'Không thể tải danh sách danh mục.');
    } finally {
      setLoading(false);
    }
  }, []);

  // Gọi fetchCategories khi component mount
  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  // --- Xử lý Modal ---
  const handleOpenAddModal = () => {
    setCurrentCategory(null); // Đảm bảo là chế độ thêm mới
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (category) => {
    setCurrentCategory(category);
    setIsModalOpen(true);
  };

  const handleOpenDeleteDialog = (category) => {
    setCategoryToDelete(category);
    setIsDeleteDialogOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentCategory(null); // Reset khi đóng
  };

  const handleCloseDeleteDialog = () => {
    setIsDeleteDialogOpen(false);
    setCategoryToDelete(null);
  };

  // --- Xử lý CRUD ---
  const handleSaveCategory = async (categoryData) => {
    setLoading(true); // Có thể thêm loading indicator riêng cho modal
    try {
      if (currentCategory) {
        // Edit mode
        await categoryApiService.updateCategory(currentCategory.id, categoryData);
        toast.success('Cập nhật danh mục thành công!');
      } else {
        // Add mode
        await categoryApiService.createCategory(categoryData);
        toast.success('Thêm danh mục thành công!');
      }
      handleCloseModal();
      fetchCategories(); // Tải lại danh sách
    } catch (err) {
      console.error("Save category error:", err);
      toast.error(err.message || 'Lưu danh mục thất bại.');
      // Có thể giữ modal mở nếu có lỗi để user sửa lại
    } finally {
        setLoading(false); // Kết thúc loading chung (hoặc loading của modal)
    }
  };

  const handleDeleteConfirm = async () => {
    if (!categoryToDelete) return;
    setLoading(true); // Có thể thêm loading indicator riêng cho modal delete
    try {
      await categoryApiService.deleteCategory(categoryToDelete.id);
      toast.success(`Xóa danh mục "${categoryToDelete.name}" thành công!`);
      handleCloseDeleteDialog();
      fetchCategories(); // Tải lại danh sách
    } catch (err) {
      console.error("Delete category error:", err);
      toast.error(err.message || 'Xóa danh mục thất bại.');
    } finally {
        setLoading(false); // Kết thúc loading chung
    }
  };

  // --- Render ---
  return (
    <div className="container mx-auto px-4 sm:px-8">
      <ToastContainer autoClose={3000} hideProgressBar />
      <div className="py-8">
        <div className="flex flex-row justify-between items-center mb-4">
          <h1 className="text-2xl font-semibold leading-tight text-gray-800">
            Quản lý Danh mục
          </h1>
          <button
            onClick={handleOpenAddModal}
            className="flex items-center bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg transition duration-150 ease-in-out"
          >
            <AiOutlinePlus className="mr-2" /> Thêm Danh mục
          </button>
        </div>

        {loading && <p className="text-center text-gray-500">Đang tải...</p>}
        {error && <p className="text-center text-red-500">{error}</p>}

        {!loading && !error && (
          <CategoryTable
            categories={categories}
            onEdit={handleOpenEditModal}
            onDelete={handleOpenDeleteDialog}
          />
        )}
      </div>

      {/* Modals */}
      <CategoryModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSaveCategory}
        category={currentCategory} // Truyền category hiện tại (null nếu là add)
      />

      <ConfirmDeleteModal
        isOpen={isDeleteDialogOpen}
        onClose={handleCloseDeleteDialog}
        onConfirm={handleDeleteConfirm}
        itemName={categoryToDelete?.name} // Lấy tên để hiển thị xác nhận
        itemType="danh mục"
      />
    </div>
  );
}

export default ManageCategories;