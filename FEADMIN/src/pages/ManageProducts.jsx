import React, { useState, useEffect, useCallback, useMemo } from 'react';
import productApiService from '../services/productApiService';
import ConfirmDeleteModal from '../components/Shared/ConfirmDeleteModal';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AiOutlinePlus } from 'react-icons/ai';
import { FaSearch } from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import ProductTable from '../components/Products/ProductTable';

function ManageProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);

  const { handleUnauthorized } = useAuth();
  const navigate = useNavigate();

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const productsData = await productApiService.getAllProducts();
      setProducts(productsData || []);
    } catch (err) {
      console.error("Fetch products error in component:", err);
      toast.error(err.message || 'Không thể tải dữ liệu sản phẩm.');
      if (err.shouldLogout || err.status === 401) {
        handleUnauthorized();
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  }, [handleUnauthorized, navigate]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

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

  const handleOpenAddProductPage = () => {
    // Navigate to a dedicated add product page or open a modal for adding
    // For simplicity, let's assume you might want to navigate to the edit page with a "new" ID
    // or have a different flow for adding. For now, let's keep it as navigating to an edit page for a new product
    // which might mean the edit page handles 'new' state.
    // OR, simply open the existing ProductModal if you keep it for ADDING only.
    // Let's assume we want to navigate to a page similar to edit for adding, but for now, we'll use edit for an existing one.
    // A better approach for "Add" would be a separate page or a modal not tied to an existing product ID.
    // For now, this function might be for a ProductModal if you decide to keep one for *adding* products.
    // If adding is also done on the /edit page by not passing an ID, that's another pattern.
    // Let's assume for "Add Product" you will use the new edit page structure but without a productId to signify creation.
    // This requires the ProductEditPage to handle the "creation" mode.
    navigate('/admin/products/new/edit'); // Or just /admin/products/add
  };

  // MODIFIED:
  const handleOpenEditPage = (product) => {
    navigate(`/admin/products/${product.id}/edit`);
  };

  const handleOpenDeleteDialog = (product) => {
    setProductToDelete(product);
    setIsDeleteDialogOpen(true);
  };

  // const handleCloseModal = () => { // <--- REMOVE if ProductModal is removed
  //   setIsModalOpen(false);
  //   setCurrentProduct(null);
  // };

  const handleCloseDeleteDialog = () => {
    setIsDeleteDialogOpen(false);
    setProductToDelete(null);
  };

  // const handleSaveProduct = async (productData) => { // <--- REMOVE if handled on Edit Page
  // ...
  // };

  const handleDeleteConfirm = async () => {
    if (!productToDelete) return;
    try {
      await productApiService.deleteProduct(productToDelete.id); // This is hard delete for the main product
      toast.success(`Xóa sản phẩm "${productToDelete.name}" thành công!`);
      handleCloseDeleteDialog();
      fetchProducts();
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
    <div className="container mx-auto  sm:px-8">
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
              onClick={handleOpenAddProductPage} // This now might navigate to /admin/products/new/edit
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
                onEdit={handleOpenEditPage} // <--- MODIFIED
                onDelete={handleOpenDeleteDialog} // This is for the main product's hard delete
              />
            )}
          </>
        )}
      </div>

      {/* ProductModal is removed from here if editing is on a new page
      <ProductModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSaveProduct}
        product={currentProduct}
        categories={categoriesForModal} // categoriesForModal would need to be fetched if this modal is kept for ADD
      /> */}

      <ConfirmDeleteModal
        isOpen={isDeleteDialogOpen}
        onClose={handleCloseDeleteDialog}
        onConfirm={handleDeleteConfirm}
        itemName={productToDelete?.name}
        itemType="sản phẩm"
        actionType="xóa vĩnh viễn" // Clarify it's a hard delete for the main product
      />
    </div>
  );
}

export default ManageProducts;