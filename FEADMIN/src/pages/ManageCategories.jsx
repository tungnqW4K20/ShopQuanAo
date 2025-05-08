import React, { useState, useEffect, useCallback } from 'react';
import categoryApiService from '../services/categoryApiService'; 
import CategoryTable from '../components/Category/CategoryTable'; 
import CategoryModal from '../components/Category/CategoryModal'; 
import ConfirmDeleteModal from '../components/Category/ConfirmDeleteModal'; 
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AiOutlinePlus } from 'react-icons/ai';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

function ManageCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentCategory, setCurrentCategory] = useState(null);
  const [categoryToDelete, setCategoryToDelete] = useState(null);

  const { handleUnauthorized } = useAuth(); 
  const navigate = useNavigate(); 

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    try {
      const data = await categoryApiService.getAllCategories();
      setCategories(data);
    } catch (err) {
      console.error("Fetch categories error in component:", err);
      toast.error(err.message || 'Không thể tải danh sách danh mục.');
      if (err.shouldLogout || err.status === 401) { 
        handleUnauthorized();
        navigate('/login'); 
      }
    } finally {
      setLoading(false);
    }
  }, [handleUnauthorized, navigate]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const handleOpenAddModal = () => {
    setCurrentCategory(null);
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
    setCurrentCategory(null);
  };

  const handleCloseDeleteDialog = () => {
    setIsDeleteDialogOpen(false);
    setCategoryToDelete(null);
  };

  const handleSaveCategory = async (categoryData) => {
    const actionType = currentCategory ? 'Cập nhật' : 'Thêm';
    try {
      if (currentCategory) {
        await categoryApiService.updateCategory(currentCategory.id, categoryData);
      } else {
        await categoryApiService.createCategory(categoryData);
      }
      toast.success(`${actionType} danh mục thành công!`);
      handleCloseModal();
      fetchCategories();
    } catch (err) {
      console.error(`Save category error (${actionType}):`, err);
      toast.error(err.message || `${actionType} danh mục thất bại.`);
      if (err.shouldLogout || err.status === 401) {
        handleUnauthorized();
        navigate('/login');
      }
    } finally {
    }
  };

  const handleDeleteConfirm = async () => {
    if (!categoryToDelete) return;
    try {
      await categoryApiService.deleteCategory(categoryToDelete.id);
      toast.success(`Xóa danh mục "${categoryToDelete.name}" thành công!`);
      handleCloseDeleteDialog();
      fetchCategories();
    } catch (err) {
      console.error("Delete category error:", err);
      toast.error(err.message || 'Xóa danh mục thất bại.');
      if (err.shouldLogout || err.status === 401) {
        handleUnauthorized();
        navigate('/login');
      }
    } finally {
    }
  };

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

        {!loading && ( 
          <CategoryTable
            categories={categories}
            onEdit={handleOpenEditModal}
            onDelete={handleOpenDeleteDialog}
          />
        )}
      </div>

      <CategoryModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSaveCategory}
        category={currentCategory}
      />

      <ConfirmDeleteModal
        isOpen={isDeleteDialogOpen}
        onClose={handleCloseDeleteDialog}
        onConfirm={handleDeleteConfirm}
        itemName={categoryToDelete?.name}
        itemType="danh mục"
      />
    </div>
  );
}

export default ManageCategories;