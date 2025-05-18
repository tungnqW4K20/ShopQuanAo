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

import { FaSpinner, FaArrowLeft, FaImage } from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';

function ProductVariantManagementPage() {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { handleUnauthorized } = useAuth();

  const [product, setProduct] = useState(null);
  const [categoryName, setCategoryName] = useState('');
  const [categories, setCategories] = useState([]);

  const [colorVariants, setColorVariants] = useState([]);
  const [showAllColorVariants, setShowAllColorVariants] = useState(false);
  const [isColorModalOpen, setIsColorModalOpen] = useState(false);
  const [currentColorVariant, setCurrentColorVariant] = useState(null);

  const [sizeVariants, setSizeVariants] = useState([]);
  const [showAllSizeVariants, setShowAllSizeVariants] = useState(false);
  const [isSizeModalOpen, setIsSizeModalOpen] = useState(false);
  const [currentSizeVariant, setCurrentSizeVariant] = useState(null);

  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [itemToConfirm, setItemToConfirm] = useState(null);

  const [loading, setLoading] = useState(true);

  const fetchProductDetails = useCallback(async () => {
    if (!productId) {
        toast.error("Không tìm thấy ID sản phẩm.");
        navigate('/admin/products');
        return;
    }
    setLoading(true);
    try {
      const productData = await productApiService.getProductById(productId);
      setProduct(productData);
      const cats = await categoryApiService.getAllCategories();
      setCategories(cats || []);
      const cat = cats.find(c => c.id === productData.category_id);
      setCategoryName(cat ? cat.name : 'Không có');

    } catch (err) {
      toast.error(`Không thể tải chi tiết sản phẩm: ${err.message}`);
      if (err.shouldLogout || err.status === 401) handleUnauthorized();
      navigate('/admin/products');
    } finally {
      setLoading(false);
    }
  }, [productId, navigate, handleUnauthorized]);


  const fetchColorVariants = useCallback(async () => {
    if (!productId) return;
    try {
      const data = showAllColorVariants
        ? await colorProductApiService.getAllColorProductsByProductIdIncludingDeleted(productId)
        : await colorProductApiService.getAllColorProductsByProductId(productId);
      setColorVariants(data || []);
    } catch (err) {
      toast.error(`Không thể tải biến thể màu: ${err.message}`);
      if (err.shouldLogout || err.status === 401) handleUnauthorized();
    }
  }, [productId, showAllColorVariants, handleUnauthorized]);

  const fetchSizeVariants = useCallback(async () => {
    if (!productId) return;
    try {
      const data = showAllSizeVariants
        ? await sizeProductApiService.getAllSizeProductsByProductIdIncludingDeleted(productId)
        : await sizeProductApiService.getAllSizeProductsByProductId(productId);
      setSizeVariants(data || []);
    } catch (err) {
      toast.error(`Không thể tải biến thể kích thước: ${err.message}`);
      if (err.shouldLogout || err.status === 401) handleUnauthorized();
    }
  }, [productId, showAllSizeVariants, handleUnauthorized]);

  useEffect(() => {
    fetchProductDetails();
  }, [fetchProductDetails]);

  useEffect(() => {
    if (productId) {
        fetchColorVariants();
    }
  }, [fetchColorVariants, productId]);

  useEffect(() => {
    if (productId) {
        fetchSizeVariants();
    }
  }, [fetchSizeVariants, productId]);

  const handleOpenAddColorModal = () => {
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
      if (err.shouldLogout || err.status === 401) handleUnauthorized();
    }
  };

  const handleOpenAddSizeModal = () => {
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
      if (err.shouldLogout || err.status === 401) handleUnauthorized();
    }
  };

  const openConfirmModal = (item, action, type) => {
    setItemToConfirm({ item, action, type });
    setIsConfirmModalOpen(true);
  };

  const handleConfirmAction = async () => {
    if (!itemToConfirm) return;
    const { item, action, type } = itemToConfirm;
    let service;
    let successMessage = '';
    let operationFailedMessage = `Thao tác thất bại: `;

    try {
      if (type === 'color') {
        service = colorProductApiService;
        if (action === 'soft-delete') {
          await service.softDeleteColorProduct(item.id);
          successMessage = `Đã xóa mềm biến thể màu "${item.name}".`;
        } else if (action === 'hard-delete') {
          await service.hardDeleteColorProduct(item.id);
          successMessage = `Đã xóa vĩnh viễn biến thể màu "${item.name}".`;
        } else if (action === 'restore') {
          await service.restoreColorProduct(item.id);
          successMessage = `Đã khôi phục biến thể màu "${item.name}".`;
        }
      } else if (type === 'size') {
        service = sizeProductApiService;
        if (action === 'soft-delete') {
          await service.softDeleteSizeProduct(item.id);
          successMessage = `Đã xóa mềm biến thể kích thước "${item.name}".`;
        } else if (action === 'hard-delete') {
          await service.hardDeleteSizeProduct(item.id);
          successMessage = `Đã xóa vĩnh viễn biến thể kích thước "${item.name}".`;
        } else if (action === 'restore') {
          await service.restoreSizeProduct(item.id);
          successMessage = `Đã khôi phục biến thể kích thước "${item.name}".`;
        }
      } else {
        throw new Error("Loại biến thể không hợp lệ.");
      }
      
      toast.success(successMessage);
      if (type === 'color') fetchColorVariants();
      if (type === 'size') fetchSizeVariants();

    } catch (err) {
      toast.error(`${operationFailedMessage}${err.message}`);
      if (err.shouldLogout || err.status === 401) handleUnauthorized();
    } finally {
      setIsConfirmModalOpen(false);
      setItemToConfirm(null);
    }
  };


  if (loading) {
    return <div className="flex justify-center items-center h-screen"><FaSpinner className="animate-spin text-4xl text-indigo-600" /></div>;
  }

  if (!product) {
    return (
        <div className="container mx-auto px-4 sm:px-8 py-8 text-center">
            <h1 className="text-xl text-red-500">Không tìm thấy thông tin sản phẩm.</h1>
            <Link to="/manage/products" className="mt-4 inline-flex items-center text-indigo-600 hover:text-indigo-800">
              <FaArrowLeft className="mr-2" /> Quay lại danh sách sản phẩm
            </Link>
        </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-8 py-8">
      <ToastContainer autoClose={3000} hideProgressBar />
      <div className="mb-6">
        <Link to="/manage/products" className="inline-flex items-center text-indigo-600 hover:text-indigo-800">
          <FaArrowLeft className="mr-2" /> Quay lại danh sách sản phẩm
        </Link>
      </div>
      <h1 className="text-2xl sm:text-3xl font-semibold leading-tight text-gray-800 mb-6">
        Quản Lý Biến Thể Cho Sản Phẩm: {product.name}
      </h1>

      <div className="bg-white shadow-md rounded-lg p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Thông Tin Sản Phẩm</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-500">Tên Sản phẩm</label>
                <p className="mt-1 text-md text-gray-900">{product.name || 'N/A'}</p>
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-500">Giá (VNĐ)</label>
                <p className="mt-1 text-md text-gray-900">
                    {product.price !== null ? `${Number(product.price).toLocaleString('vi-VN')} VNĐ` : 'N/A'}
                </p>
            </div>
            <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-500">Mô tả</label>
                <p className="mt-1 text-md text-gray-900 whitespace-pre-wrap">{product.description || 'N/A'}</p>
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-500">Danh mục</label>
                <p className="mt-1 text-md text-gray-900">{categoryName || 'N/A'}</p>
            </div>
            <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-500 mb-1">Ảnh Sản phẩm</label>
                {product.image_url ? (
                    <img 
                        src={product.image_url} 
                        alt={product.name} 
                        className="mt-1 max-w-xs h-auto rounded-md border border-gray-300 shadow-sm"
                        onError={(e) => { e.target.onerror = null; e.target.src="https://via.placeholder.com/150?text=No+Image"; e.target.alt="Image not found"}}
                    />
                ) : (
                    <div className="mt-1 flex items-center justify-center w-32 h-32 bg-gray-100 rounded-md border border-gray-300 text-gray-400">
                        <FaImage size={40} />
                    </div>
                )}
            </div>
        </div>
      </div>

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

      <ColorProductModal
        isOpen={isColorModalOpen}
        onClose={() => setIsColorModalOpen(false)}
        onSubmit={handleSaveColorVariant}
        colorProduct={currentColorVariant}
        productId={productId}
      />
      <SizeProductModal
        isOpen={isSizeModalOpen}
        onClose={() => setIsSizeModalOpen(false)}
        onSubmit={handleSaveSizeVariant}
        sizeProduct={currentSizeVariant}
        productId={productId}
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
            itemToConfirm?.action === 'restore' ? 'khôi phục' : 'thực hiện' // fallback
        }
        isRestore={itemToConfirm?.action === 'restore'}
      />
    </div>
  );
}

export default ProductVariantManagementPage;