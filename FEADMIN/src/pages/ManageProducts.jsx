// src/pages/ManageProducts.jsx (or similar path)
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import productApiService from '../services/productApiService';
import categoryApiService from '../services/categoryApiService'; // To fetch categories for modal
import ProductTable from '../components/Products/ProductTable'; // Adjust path as needed
import ProductModal from '../components/Products/ProductModal';   // Adjust path as needed
import ConfirmDeleteModal from '../components/Category/ConfirmDeleteModal'; // Reusable
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AiOutlinePlus } from 'react-icons/ai';
import { FaSearch } from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext'; // Assuming you have this
import { useNavigate } from 'react-router-dom';

function ManageProducts() {
  const [products, setProducts] = useState([]);
  const [categoriesForModal, setCategoriesForModal] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [productToDelete, setProductToDelete] = useState(null);

  const { handleUnauthorized } = useAuth();
  const navigate = useNavigate();

  const fetchPageData = useCallback(async () => {
    setLoading(true);
    try {
      const [productsData, categoriesData] = await Promise.all([
        productApiService.getAllProducts(),
        categoryApiService.getAllCategories() // For the modal dropdown
      ]);
      setProducts(productsData || []);
      setCategoriesForModal(categoriesData || []);
    } catch (err) {
      console.error("Fetch products/categories error in component:", err);
      toast.error(err.message || 'Không thể tải dữ liệu sản phẩm hoặc danh mục.');
      if (err.shouldLogout || err.status === 401) {
        handleUnauthorized();
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  }, [handleUnauthorized, navigate]);

  useEffect(() => {
    fetchPageData();
  }, [fetchPageData]);

  const filteredProducts = useMemo(() => {
    if (!searchTerm.trim()) {
      return products;
    }
    return products.filter(product =>
      product.name && product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [products, searchTerm]);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleOpenAddModal = () => {
    setCurrentProduct(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (product) => {
    setCurrentProduct(product);
    setIsModalOpen(true);
  };

  const handleOpenDeleteDialog = (product) => {
    setProductToDelete(product);
    setIsDeleteDialogOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentProduct(null);
  };

  const handleCloseDeleteDialog = () => {
    setIsDeleteDialogOpen(false);
    setProductToDelete(null);
  };

  const handleSaveProduct = async (productData) => {
    const actionType = currentProduct ? 'Cập nhật' : 'Thêm';
    try {
      if (currentProduct) {
        await productApiService.updateProduct(currentProduct.id, productData);
      } else {
        await productApiService.createProduct(productData);
      }
      toast.success(`${actionType} sản phẩm thành công!`);
      handleCloseModal();
      fetchPageData(); // Refetch products (and categories, though unlikely to change here)
    } catch (err) {
      console.error(`Save product error (${actionType}):`, err);
      toast.error(err.message || `${actionType} sản phẩm thất bại.`);
      if (err.shouldLogout || err.status === 401) {
        handleUnauthorized();
        navigate('/login');
      }
    }
  };

  const handleDeleteConfirm = async () => {
    if (!productToDelete) return;
    try {
      await productApiService.deleteProduct(productToDelete.id);
      toast.success(`Xóa sản phẩm "${productToDelete.name}" thành công!`);
      handleCloseDeleteDialog();
      fetchPageData(); // Refetch products
    } catch (err) {
      console.error("Delete product error:", err);
      toast.error(err.message || 'Xóa sản phẩm thất bại.');
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
            Quản lý Sản phẩm
          </h1>
          <div className="flex items-center space-x-3 w-full sm:w-auto">
            <div className="relative flex-grow sm:flex-grow-0">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="text-gray-400" />
              </span>
              <input
                type="text"
                placeholder="Tìm theo tên sản phẩm..."
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
              <AiOutlinePlus className="mr-2" /> Thêm Sản phẩm
            </button>
          </div>
        </div>

        {loading && <p className="text-center text-gray-500 py-4">Đang tải danh sách sản phẩm...</p>}

        {!loading && (
          <>
            {products.length > 0 && filteredProducts.length === 0 && searchTerm.trim() !== '' ? (
              <p className="text-center text-gray-500 py-4">
                Không tìm thấy sản phẩm nào khớp với tìm kiếm "{searchTerm}".
              </p>
            ) : (
              <ProductTable
                products={filteredProducts}
                onEdit={handleOpenEditModal}
                onDelete={handleOpenDeleteDialog}
              />
            )}
          </>
        )}
      </div>

      <ProductModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSaveProduct}
        product={currentProduct}
        categories={categoriesForModal}
      />

      <ConfirmDeleteModal
        isOpen={isDeleteDialogOpen}
        onClose={handleCloseDeleteDialog}
        onConfirm={handleDeleteConfirm}
        itemName={productToDelete?.name}
        itemType="sản phẩm"
      />
    </div>
  );
}

export default ManageProducts;