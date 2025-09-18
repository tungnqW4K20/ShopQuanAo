import React, { useState, useEffect, useCallback, useMemo } from 'react';
import categoryApiService from '../services/categoryApiService';
import CategoryTable from '../components/Category/CategoryTable';
import CategoryModal from '../components/Category/CategoryModal';
import ConfirmDeleteModal from '../components/Category/ConfirmDeleteModal';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AiOutlinePlus } from 'react-icons/ai';
import { FaSearch } from 'react-icons/fa'; 
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

function ManageCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(''); 

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

  const filteredCategories = useMemo(() => {
    if (!searchTerm.trim()) {
      return categories; 
    }
    return categories.filter(category =>
      category.name && category.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [categories, searchTerm]);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

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
    }
  };

  return (
    <div className="container mx-auto px-4 sm:px-8">
      <ToastContainer autoClose={3000} hideProgressBar />
      <div className="py-8">
        
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 space-y-3 sm:space-y-0"> 
          <h1 className="text-2xl font-semibold leading-tight text-gray-800 self-start sm:self-center">
            Quản lý Danh mục
          </h1>
          <div className="flex items-center space-x-3 w-full sm:w-auto">
            <div className="relative flex-grow sm:flex-grow-0">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="text-gray-400" />
              </span>
              <input
                type="text"
                placeholder="Tìm theo tên danh mục..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                style={{ minWidth: '200px' }} 
              />
            </div>
            
            <button
              onClick={handleOpenAddModal}
              className="flex items-center bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg transition duration-150 ease-in-out whitespace-nowrap"
            >
              <AiOutlinePlus className="mr-2" /> Thêm Danh mục
            </button>
          </div>
        </div>

        {loading && <p className="text-center text-gray-500 py-4">Đang tải danh sách danh mục...</p>}

        {!loading && (
          <>
            {categories.length > 0 && filteredCategories.length === 0 && searchTerm.trim() !== '' ? (
              <p className="text-center text-gray-500 py-4">
                Không tìm thấy danh mục nào khớp với tìm kiếm "{searchTerm}".
              </p>
            ) : (
              <CategoryTable
                categories={filteredCategories} 
                onEdit={handleOpenEditModal}
                onDelete={handleOpenDeleteDialog}
              />
            )}
          </>
        )}
      </div>

      { isModalOpen && 
        <CategoryModal
          onClose={handleCloseModal}
          onSubmit={handleSaveCategory}
          category={currentCategory}
        />
      }

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

