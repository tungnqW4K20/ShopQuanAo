import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import productApiService from '../services/productApiService';
import categoryApiService from '../services/categoryApiService';
import colorProductApiService from '../services/colorProductApiService';
import sizeProductApiService from '../services/sizeProductApiService';

import ColorProductTable from '../components/Products/ColorProductTable';
import SizeProductTable from '../components/Products/SizeProductTable';
import ColorProductModal from '../components/Products/ColorProductModal';
import SizeProductModal from '../components/Products/SizeProductModal';
import ConfirmDeleteModal from '../components/Shared/ConfirmDeleteModal';

import { FaSave, FaSpinner, FaArrowLeft } from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext'; // Assuming you have this

function ProductEditPage() {
  const { productId } = useParams(); // Gets productId from URL
  const navigate = useNavigate();
  const { handleUnauthorized } = useAuth(); // Assuming useAuth provides this

  const isNewProduct = productId === 'new'; // Check if we are creating a new product

  // Main Product State
  const [product, setProduct] = useState(null);
  const [productFormData, setProductFormData] = useState({
    name: '',
    description: '',
    price: '',
    image_url: '',
    category_id: '',
  });
  const [categories, setCategories] = useState([]);
  const [productFormErrors, setProductFormErrors] = useState({});
  const [isSavingProduct, setIsSavingProduct] = useState(false);

  // Color Variants State
  const [colorVariants, setColorVariants] = useState([]);
  const [showAllColorVariants, setShowAllColorVariants] = useState(false); // To toggle including soft-deleted
  const [isColorModalOpen, setIsColorModalOpen] = useState(false);
  const [currentColorVariant, setCurrentColorVariant] = useState(null);

  // Size Variants State
  const [sizeVariants, setSizeVariants] = useState([]);
  const [showAllSizeVariants, setShowAllSizeVariants] = useState(false);
  const [isSizeModalOpen, setIsSizeModalOpen] = useState(false);
  const [currentSizeVariant, setCurrentSizeVariant] = useState(null);

  // Confirmation Modal State
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [itemToConfirm, setItemToConfirm] = useState(null); // { item: object, action: 'soft-delete' | 'hard-delete' | 'restore', type: 'color' | 'size' }

  const [loading, setLoading] = useState(!isNewProduct); // Don't load if new product

  // --- Fetching Data ---
  const fetchProductDetails = useCallback(async () => {
    if (isNewProduct) {
      setProduct(null); // Ensure product is null for new
      setProductFormData({ name: '', description: '', price: '', image_url: '', category_id: '' });
      setColorVariants([]);
      setSizeVariants([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const productData = await productApiService.getProductById(productId);
      setProduct(productData);
      setProductFormData({
        name: productData.name || '',
        description: productData.description || '',
        price: productData.price !== null ? String(productData.price) : '',
        image_url: productData.image_url || '',
        category_id: productData.category_id !== null ? String(productData.category_id) : '',
      });
    } catch (err) {
      toast.error(`Không thể tải chi tiết sản phẩm: ${err.message}`);
      if (err.shouldLogout || err.status === 401) handleUnauthorized();
      navigate('/admin/products'); // Navigate back if product not found or error
    } finally {
      setLoading(false);
    }
  }, [productId, navigate, handleUnauthorized, isNewProduct]);

  const fetchCategories = useCallback(async () => {
    try {
      const cats = await categoryApiService.getAllCategories();
      setCategories(cats || []);
    } catch (err) {
      toast.error(`Không thể tải danh mục: ${err.message}`);
    }
  }, []);

  const fetchColorVariants = useCallback(async () => {
    if (isNewProduct || !productId) return;
    try {
      const data = showAllColorVariants
        ? await colorProductApiService.getAllColorProductsByProductIdIncludingDeleted(productId)
        : await colorProductApiService.getAllColorProductsByProductId(productId);
      setColorVariants(data || []);
    } catch (err) {
      toast.error(`Không thể tải biến thể màu: ${err.message}`);
    }
  }, [productId, showAllColorVariants, isNewProduct]);

  const fetchSizeVariants = useCallback(async () => {
    if (isNewProduct || !productId) return;
    try {
      const data = showAllSizeVariants
        ? await sizeProductApiService.getAllSizeProductsByProductIdIncludingDeleted(productId)
        : await sizeProductApiService.getAllSizeProductsByProductId(productId);
      setSizeVariants(data || []);
    } catch (err) {
      toast.error(`Không thể tải biến thể kích thước: ${err.message}`);
    }
  }, [productId, showAllSizeVariants, isNewProduct]);

  useEffect(() => {
    fetchProductDetails();
    fetchCategories();
  }, [fetchProductDetails, fetchCategories]);

  useEffect(() => {
    if (!isNewProduct) {
        fetchColorVariants();
    }
  }, [fetchColorVariants, isNewProduct]);

  useEffect(() => {
    if (!isNewProduct) {
        fetchSizeVariants();
    }
  }, [fetchSizeVariants, isNewProduct]);


  // --- Main Product Form Handling ---
  const handleProductFormChange = (e) => {
    const { name, value } = e.target;
    setProductFormData(prev => ({ ...prev, [name]: value }));
    if (productFormErrors[name]) {
      setProductFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateProductForm = () => {
    const newErrors = {};
    if (!productFormData.name.trim()) newErrors.name = 'Tên sản phẩm không được để trống.';
    if (!productFormData.description.trim()) newErrors.description = 'Mô tả không được để trống.';
    if (productFormData.price.trim() && isNaN(parseFloat(productFormData.price))) {
      newErrors.price = 'Giá phải là một số.';
    } else if (productFormData.price.trim() && parseFloat(productFormData.price) < 0) {
      newErrors.price = 'Giá không được âm.';
    }
    if (productFormData.image_url.trim() && !/^(ftp|http|https):\/\/[^ "]+$/.test(productFormData.image_url.trim())) {
        newErrors.image_url = 'Link ảnh không hợp lệ.';
    }
    setProductFormErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSaveMainProduct = async (e) => {
    e.preventDefault();
    if (!validateProductForm()) return;
    setIsSavingProduct(true);
    const dataToSubmit = {
      ...productFormData,
      price: productFormData.price.trim() ? parseFloat(productFormData.price) : null,
      category_id: productFormData.category_id ? parseInt(productFormData.category_id, 10) : null,
      image_url: productFormData.image_url.trim() ? productFormData.image_url.trim() : null,
    };

    try {
      if (isNewProduct) {
        const newProd = await productApiService.createProduct(dataToSubmit);
        toast.success('Thêm sản phẩm mới thành công!');
        navigate(`/admin/products/${newProd.id}/edit`); // Navigate to edit page of newly created product
      } else {
        await productApiService.updateProduct(productId, dataToSubmit);
        toast.success('Cập nhật thông tin sản phẩm thành công!');
        fetchProductDetails(); // Re-fetch to ensure data consistency
      }
    } catch (err) {
      toast.error(`Lưu sản phẩm thất bại: ${err.message}`);
      if (err.shouldLogout || err.status === 401) handleUnauthorized();
    } finally {
      setIsSavingProduct(false);
    }
  };

  // --- Color Variant Modal & Actions ---
  const handleOpenAddColorModal = () => {
    if (isNewProduct) {
        toast.error("Vui lòng lưu sản phẩm chính trước khi thêm biến thể.");
        return;
    }
    setCurrentColorVariant(null);
    setIsColorModalOpen(true);
  };
  const handleOpenEditColorModal = (colorVar) => {
    setCurrentColorVariant(colorVar);
    setIsColorModalOpen(true);
  };
  const handleSaveColorVariant = async (data) => {
    const actionType = currentColorVariant ? 'Cập nhật' : 'Thêm';
    try {
      if (currentColorVariant) {
        await colorProductApiService.updateColorProduct(currentColorVariant.id, data);
      } else {
        await colorProductApiService.createColorProduct({ ...data, product_id: parseInt(productId) });
      }
      toast.success(`${actionType} biến thể màu thành công!`);
      setIsColorModalOpen(false);
      fetchColorVariants();
    } catch (err) {
      toast.error(`${actionType} biến thể màu thất bại: ${err.message}`);
    }
  };

  // --- Size Variant Modal & Actions ---
  const handleOpenAddSizeModal = () => {
     if (isNewProduct) {
        toast.error("Vui lòng lưu sản phẩm chính trước khi thêm biến thể.");
        return;
    }
    setCurrentSizeVariant(null);
    setIsSizeModalOpen(true);
  };
  const handleOpenEditSizeModal = (sizeVar) => {
    setCurrentSizeVariant(sizeVar);
    setIsSizeModalOpen(true);
  };
  const handleSaveSizeVariant = async (data) => {
    const actionType = currentSizeVariant ? 'Cập nhật' : 'Thêm';
    try {
      if (currentSizeVariant) {
        await sizeProductApiService.updateSizeProduct(currentSizeVariant.id, data);
      } else {
        await sizeProductApiService.createSizeProduct({ ...data, product_id: parseInt(productId) });
      }
      toast.success(`${actionType} biến thể kích thước thành công!`);
      setIsSizeModalOpen(false);
      fetchSizeVariants();
    } catch (err) {
      toast.error(`${actionType} biến thể kích thước thất bại: ${err.message}`);
    }
  };

  // --- Confirmation Modal and Generic Variant Actions ---
  const openConfirmModal = (item, action, type) => {
    setItemToConfirm({ item, action, type });
    setIsConfirmModalOpen(true);
  };

  const handleConfirmAction = async () => {
    if (!itemToConfirm) return;
    const { item, action, type } = itemToConfirm;
    let service;
    let successMessage = '';

    if (type === 'color') service = colorProductApiService;
    if (type === 'size') service = sizeProductApiService;

    try {
      if (action === 'soft-delete') {
        if(type === "color") {
            await service.softDeleteColorProduct(item.id);
        }
        else if(type === "size")
        {
            await service.softDeleteSizeProduct(item.id);
        }
        successMessage = `Đã xóa mềm ${type === 'color' ? 'biến thể màu' : 'biến thể kích thước'} "${item.name}".`;
      } else if (action === 'hard-delete') {
        await service.hardDeleteColorProduct(item.id); // Same assumption
        successMessage = `Đã xóa vĩnh viễn ${type === 'color' ? 'biến thể màu' : 'biến thể kích thước'} "${item.name}".`;
      } else if (action === 'restore') {
        await service.restoreColorProduct(item.id); // Same assumption
        successMessage = `Đã khôi phục ${type === 'color' ? 'biến thể màu' : 'biến thể kích thước'} "${item.name}".`;
      }
      toast.success(successMessage);
      if (type === 'color') fetchColorVariants();
      if (type === 'size') fetchSizeVariants();
    } catch (err) {
      toast.error(`Thao tác thất bại: ${err.message}`);
    } finally {
      setIsConfirmModalOpen(false);
      setItemToConfirm(null);
    }
  };


  if (loading && !isNewProduct) {
    return <div className="flex justify-center items-center h-screen"><FaSpinner className="animate-spin text-4xl text-indigo-600" /></div>;
  }

  return (
    <div className="container mx-auto px-4 sm:px-8 py-8">
      <ToastContainer autoClose={3000} hideProgressBar />
      <div className="mb-6">
        <Link to="/admin/products" className="inline-flex items-center text-indigo-600 hover:text-indigo-800">
          <FaArrowLeft className="mr-2" /> Quay lại danh sách sản phẩm
        </Link>
      </div>
      <h1 className="text-2xl sm:text-3xl font-semibold leading-tight text-gray-800 mb-6">
        {isNewProduct ? 'Thêm Sản Phẩm Mới' : `Chỉnh Sửa Sản Phẩm: ${product?.name || ''}`}
      </h1>

      {/* Main Product Form */}
      <form onSubmit={handleSaveMainProduct} className="bg-white shadow-md rounded-lg p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Thông Tin Cơ Bản</h2>
        {/* Product Name */}
        <div className="mb-4">
            <label htmlFor="productName" className="block text-sm font-medium text-gray-700 mb-1">Tên Sản phẩm <span className="text-red-500">*</span></label>
            <input type="text" id="productName" name="name" value={productFormData.name} onChange={handleProductFormChange}
                   className={`w-full px-3 py-2 border rounded-md shadow-sm ${productFormErrors.name ? 'border-red-500' : 'border-gray-300'}`} />
            {productFormErrors.name && <p className="text-red-500 text-xs mt-1">{productFormErrors.name}</p>}
        </div>
        {/* Description */}
        <div className="mb-4">
            <label htmlFor="productDescription" className="block text-sm font-medium text-gray-700 mb-1">Mô tả <span className="text-red-500">*</span></label>
            <textarea id="productDescription" name="description" value={productFormData.description} onChange={handleProductFormChange} rows="3"
                      className={`w-full px-3 py-2 border rounded-md shadow-sm ${productFormErrors.description ? 'border-red-500' : 'border-gray-300'}`}></textarea>
            {productFormErrors.description && <p className="text-red-500 text-xs mt-1">{productFormErrors.description}</p>}
        </div>
        {/* Price, Image URL, Category (similar structure) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
                <label htmlFor="productPrice" className="block text-sm font-medium text-gray-700 mb-1">Giá (VNĐ)</label>
                <input type="number" id="productPrice" name="price" value={productFormData.price} onChange={handleProductFormChange} step="any"
                       className={`w-full px-3 py-2 border rounded-md shadow-sm ${productFormErrors.price ? 'border-red-500' : 'border-gray-300'}`} />
                {productFormErrors.price && <p className="text-red-500 text-xs mt-1">{productFormErrors.price}</p>}
            </div>
            <div>
                <label htmlFor="productCategory" className="block text-sm font-medium text-gray-700 mb-1">Danh mục</label>
                <select id="productCategory" name="category_id" value={productFormData.category_id} onChange={handleProductFormChange}
                        className={`w-full px-3 py-2 border rounded-md shadow-sm ${productFormErrors.category_id ? 'border-red-500' : 'border-gray-300'}`}>
                    <option value="">-- Chọn danh mục --</option>
                    {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                </select>
            </div>
        </div>
        <div className="mb-4">
            <label htmlFor="productImageUrl" className="block text-sm font-medium text-gray-700 mb-1">Link Ảnh</label>
            <input type="url" id="productImageUrl" name="image_url" value={productFormData.image_url} onChange={handleProductFormChange}
                   className={`w-full px-3 py-2 border rounded-md shadow-sm ${productFormErrors.image_url ? 'border-red-500' : 'border-gray-300'}`} />
            {productFormErrors.image_url && <p className="text-red-500 text-xs mt-1">{productFormErrors.image_url}</p>}
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSavingProduct}
            className="inline-flex items-center px-6 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            {isSavingProduct ? <FaSpinner className="animate-spin mr-2" /> : <FaSave className="mr-2" />}
            {isNewProduct ? 'Tạo Sản Phẩm' : 'Lưu Thay Đổi'}
          </button>
        </div>
      </form>

      {/* Color Variants Section - Only show if not a new product OR if product has been created */}
      {!isNewProduct && productId && (
        <div className="bg-white shadow-md rounded-lg p-6 mb-8">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-xl font-semibold text-gray-700">Quản lý Biến Thể Màu</h2>
            <label className="flex items-center text-sm text-gray-600">
              <input type="checkbox" checked={showAllColorVariants} onChange={(e) => setShowAllColorVariants(e.target.checked)} className="mr-2 h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500" />
              Hiện cả đã xóa mềm
            </label>
          </div>
          <ColorProductTable
            colorProducts={colorVariants}
            onAdd={handleOpenAddColorModal}
            onEdit={handleOpenEditColorModal}
            onSoftDelete={(item) => openConfirmModal(item, 'soft-delete', 'color')}
            onHardDelete={(item) => openConfirmModal(item, 'hard-delete', 'color')}
            onRestore={(item) => openConfirmModal(item, 'restore', 'color')}
            showSoftDeleted={showAllColorVariants}
          />
        </div>
      )}


      {/* Size Variants Section - Only show if not a new product OR if product has been created */}
      {!isNewProduct && productId && (
        <div className="bg-white shadow-md rounded-lg p-6">
           <div className="flex justify-between items-center mb-2">
            <h2 className="text-xl font-semibold text-gray-700">Quản lý Biến Thể Kích Thước</h2>
            <label className="flex items-center text-sm text-gray-600">
              <input type="checkbox" checked={showAllSizeVariants} onChange={(e) => setShowAllSizeVariants(e.target.checked)} className="mr-2 h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500" />
              Hiện cả đã xóa mềm
            </label>
          </div>
          <SizeProductTable
            sizeProducts={sizeVariants}
            onAdd={handleOpenAddSizeModal}
            onEdit={handleOpenEditSizeModal}
            onSoftDelete={(item) => openConfirmModal(item, 'soft-delete', 'size')}
            onHardDelete={(item) => openConfirmModal(item, 'hard-delete', 'size')}
            onRestore={(item) => openConfirmModal(item, 'restore', 'size')}
            showSoftDeleted={showAllSizeVariants}
          />
        </div>
      )}


      {/* Modals */}
      <ColorProductModal
        isOpen={isColorModalOpen}
        onClose={() => setIsColorModalOpen(false)}
        onSubmit={handleSaveColorVariant}
        colorProduct={currentColorVariant}
        productId={productId} // Pass current product ID
      />
      <SizeProductModal
        isOpen={isSizeModalOpen}
        onClose={() => setIsSizeModalOpen(false)}
        onSubmit={handleSaveSizeVariant}
        sizeProduct={currentSizeVariant}
        productId={productId} // Pass current product ID
      />
      <ConfirmDeleteModal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={handleConfirmAction}
        itemName={itemToConfirm?.item?.name}
        itemType={itemToConfirm?.type === 'color' ? 'biến thể màu' : 'biến thể kích thước'}
        actionType={
            itemToConfirm?.action === 'soft-delete' ? 'xóa mềm' :
            itemToConfirm?.action === 'hard-delete' ? 'xóa vĩnh viễn' :
            itemToConfirm?.action === 'restore' ? 'khôi phục' : 'xóa'
        }
        isRestore={itemToConfirm?.action === 'restore'}
      />
    </div>
  );
}

export default ProductEditPage;