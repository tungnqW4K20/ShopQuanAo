import React, { useState, useEffect, useCallback, useMemo } from 'react';
import productApiService from '../services/productApiService';
import ConfirmDeleteModal from '../components/Shared/ConfirmDeleteModal';
import ProductModal from '../components/Products/ProductModal';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AiOutlinePlus } from 'react-icons/ai';
import { FaSearch } from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import ProductTable from '../components/Products/ProductTable';
import categoryApiService from '../services/categoryApiService';


function ManageProducts() {
  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState({ totalItems: 0, totalPages: 1, currentPage: 1, pageSize: 10 });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [categoriesForModal, setCategoriesForModal] = useState([]);


  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);

  const { handleUnauthorized, logout } = useAuth();
  const navigate = useNavigate();

  const fetchProducts = useCallback(async (page = currentPage, search = searchTerm, pageSize = limit) => {
    setLoading(true);
    try {
      const data = await productApiService.getAllProducts({ page, limit: pageSize, search });
      setProducts(data || []);
      setPagination(data.pagination || { totalItems: 0, totalPages: 1, currentPage: page, pageSize });
    } catch (err) {
      console.error("Fetch products error in component:", err);
      toast.error(err.message || 'Không thể tải dữ liệu sản phẩm.');
      if (err.shouldLogout || err.status === 401) {
        logout();
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  }, [currentPage, searchTerm, limit, logout, navigate]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  useEffect(() => {
    const fetchCategories = async () => {
        try {
           const categories = await categoryApiService.getAllCategories();
          const simplifiedCategories = categories.map(cat => ({
            id: cat.id,
            name: cat.name,
          }));
          setCategoriesForModal(simplifiedCategories);
        } catch (error) {
            console.error("Error fetching categories for modal:", error);
            toast.error("Không thể tải danh mục.");
        }
    };
    if (isModalOpen) {
        fetchCategories();
    }
  }, [isModalOpen]);


  const filteredProducts = useMemo(() => {
    if (!searchTerm.trim() && !products.some(p => !p.name)) {
        return products;
    }
    return products.filter(product =>
        product.name && product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [products, searchTerm]);


  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1);
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    fetchProducts(1, searchTerm);
  }

  const handleOpenAddProductModal = () => {
    setCurrentProduct(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (product) => {
    setCurrentProduct(product);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentProduct(null);
  };

  const handleSaveProduct = async (productDataFromModal) => {
    setLoading(true);
    try {
      if (currentProduct && currentProduct.id) {
        await productApiService.updateProduct(currentProduct.id, productDataFromModal);
        toast.success(`Cập nhật sản phẩm "${productDataFromModal.name}" thành công!`);
      } else {
        await productApiService.createProduct(productDataFromModal);
        toast.success(`Thêm sản phẩm "${productDataFromModal.name}" thành công!`);
      }
      handleCloseModal();
      fetchProducts(currentPage, searchTerm); 
    } catch (err) {
      console.error("Save product error:", err);
      toast.error(err.message || (currentProduct ? 'Cập nhật' : 'Thêm') + ' sản phẩm thất bại.');
      if (err.shouldLogout || err.status === 401) {
        logout();
        navigate('/login');
      }
    } finally {
        setLoading(false);
    }
  };


  const handleOpenDeleteDialog = (product) => {
    setProductToDelete(product);
    setIsDeleteDialogOpen(true);
  };

  const handleCloseDeleteDialog = () => {
    setIsDeleteDialogOpen(false);
    setProductToDelete(null);
  };

  const handleDeleteConfirm = async () => {
    if (!productToDelete) return;
    setLoading(true);
    try {
      await productApiService.deleteProduct(productToDelete.id);
      toast.success(`Xóa sản phẩm "${productToDelete.name}" thành công!`);
      handleCloseDeleteDialog();
      
      const newTotalItems = pagination.totalItems - 1;
      const newTotalPages = Math.ceil(newTotalItems / limit);
      let pageToFetch = currentPage;
      if (filteredProducts.length === 1 && currentPage > 1 && currentPage > newTotalPages) {
        pageToFetch = currentPage - 1;
        setCurrentPage(pageToFetch);
      }
      fetchProducts(pageToFetch, searchTerm);
    } catch (err) {
      console.error("Delete product error:", err);
      toast.error(err.message || 'Xóa sản phẩm thất bại.');
      if (err.shouldLogout || err.status === 401) {
        logout();
        navigate('/login');
      }
    } finally {
        setLoading(false);
    }
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    fetchProducts(newPage, searchTerm);
  };


  return (
    <div className="container mx-auto sm:px-8">
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar newestOnTop />
      <div className="py-8">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 space-y-3 sm:space-y-0">
          <h1 className="text-2xl font-semibold leading-tight text-gray-800 self-start sm:self-center">
            Quản lý Sản phẩm
          </h1>
          <div className="flex items-center space-x-3 w-full sm:w-auto">
            <form onSubmit={handleSearchSubmit} className="relative flex-grow sm:flex-grow-0">
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
              
            </form>
            <button
              onClick={handleOpenAddProductModal}
              className="flex items-center bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg transition duration-150 ease-in-out whitespace-nowrap"
            >
              <AiOutlinePlus className="mr-2" /> Thêm Sản phẩm
            </button>
          </div>
        </div>

        {loading && <p className="text-center text-gray-500 py-4">Đang tải danh sách sản phẩm...</p>}

        {!loading && (
          <>
            {products.length === 0 && searchTerm.trim() === '' ? (
                 <p className="text-center text-gray-500 py-4">Chưa có sản phẩm nào.</p>
            ) : products.length > 0 && filteredProducts.length === 0 && searchTerm.trim() !== '' ? (
              <p className="text-center text-gray-500 py-4">
                Không tìm thấy sản phẩm nào khớp với tìm kiếm "{searchTerm}".
              </p>
            ) : (
              <ProductTable
                products={filteredProducts} 
                onEdit={handleOpenEditModal}
                onDelete={handleOpenDeleteDialog}
                pagination={pagination}
                onPageChange={handlePageChange}
                currentPage={currentPage} 
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
        actionType="xóa vĩnh viễn"
      />
    </div>
  );
}

export default ManageProducts;