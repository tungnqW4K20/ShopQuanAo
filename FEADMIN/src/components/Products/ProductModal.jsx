// src/components/Products/ProductModal.js
import React, { useState, useEffect, useRef } from 'react';
import uploadApiService from '../../services/uploadApiService'; // Đảm bảo import đúng
import { toast } from 'react-toastify';
// 'react-toastify/dist/ReactToastify.css'; // CSS đã import ở ManageProducts hoặc App.js

function ProductModal({ isOpen, onClose, onSubmit, product, categories = [] }) {
  const initialFormData = {
    name: '',
    description: '',
    price: '',
    image_url: '',
    category_id: '',
  };
  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({});
  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      if (product) {
        setFormData({
          name: product.name || '',
          description: product.description || '',
          price: product.price !== null && product.price !== undefined ? String(product.price) : '',
          image_url: product.image_url || '',
          category_id: product.category_id !== null && product.category_id !== undefined ? String(product.category_id) : '',
        });
        setImagePreviewUrl(product.image_url || '');
      } else {
        setFormData(initialFormData);
        setImagePreviewUrl('');
      }
      setSelectedFile(null);
      setErrors({});
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  }, [product, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast.error("Kích thước ảnh không được vượt quá 5MB.");
        setSelectedFile(null);
        setImagePreviewUrl(formData.image_url || '');
        if (fileInputRef.current) fileInputRef.current.value = "";
        return;
      }
      if (!file.type.startsWith('image/')) {
        toast.error("Chỉ cho phép tải lên tệp hình ảnh.");
        setSelectedFile(null);
        setImagePreviewUrl(formData.image_url || '');
        if (fileInputRef.current) fileInputRef.current.value = "";
        return;
      }
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
      if (errors.image_url) {
        setErrors((prev) => ({ ...prev, image_url: '' }));
      }
    } else {
      setSelectedFile(null);
      setImagePreviewUrl(formData.image_url || '');
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Tên sản phẩm không được để trống.';
    if (!formData.description.trim()) newErrors.description = 'Mô tả không được để trống.';
    if (formData.price.trim() && isNaN(parseFloat(formData.price))) {
      newErrors.price = 'Giá phải là một số hợp lệ.';
    } else if (formData.price.trim() && parseFloat(formData.price) < 0) {
      newErrors.price = 'Giá không được âm.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    let finalImageUrl = formData.image_url; // Giữ URL cũ nếu không có file mới

    if (selectedFile) { // Nếu người dùng chọn file mới
      setIsUploading(true);
      try {
        const uploadedImageUrl = await uploadApiService.uploadProductImage(selectedFile);
        finalImageUrl = uploadedImageUrl; // Cập nhật URL mới
        toast.success("Tải ảnh lên thành công!");
      } catch (error) {
        console.error("Upload error in modal:", error);
        toast.error(error.message || "Lỗi khi tải ảnh lên.");
        setIsUploading(false);
        return; // Dừng nếu upload lỗi
      } finally {
        setIsUploading(false);
      }
    }

    const dataToSubmit = {
      ...formData,
      price: formData.price.trim() ? parseFloat(formData.price) : null,
      category_id: formData.category_id ? parseInt(formData.category_id, 10) : null,
      image_url: finalImageUrl, 
    };
    onSubmit(dataToSubmit); 
  };

  const handleClose = () => {
    setFormData(initialFormData);
    setErrors({});
    setSelectedFile(null);
    setImagePreviewUrl('');
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    onClose();
  };

  const handleRemoveImage = () => {
    setSelectedFile(null);
    setImagePreviewUrl('');
    setFormData(prev => ({ ...prev, image_url: '' })); 
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 transition-opacity duration-300 ease-in-out">
      
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-lg transform transition-all duration-300 ease-in-out scale-100 max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">
          {product ? 'Sửa Sản phẩm' : 'Thêm Sản phẩm Mới'}
        </h2>
        <form onSubmit={handleSubmit} noValidate>
          
          <div className="mb-3">
            <label htmlFor="productName" className="block text-sm font-medium text-gray-700 mb-1">
              Tên Sản phẩm <span className="text-red-500">*</span>
            </label>
            <input
              type="text" id="productName" name="name" value={formData.name} onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 ${errors.name ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-indigo-500'} sm:text-sm`}
              placeholder="Nhập tên sản phẩm..."
            />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
          </div>

          <div className="mb-3">
            <label htmlFor="productDescription" className="block text-sm font-medium text-gray-700 mb-1">
              Mô tả <span className="text-red-500">*</span>
            </label>
            <textarea
              id="productDescription" name="description" value={formData.description} onChange={handleChange} rows="3"
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 ${errors.description ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-indigo-500'} sm:text-sm`}
              placeholder="Mô tả chi tiết sản phẩm..."
            ></textarea>
            {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
          </div>

          <div className="mb-3">
            <label htmlFor="productPrice" className="block text-sm font-medium text-gray-700 mb-1">Giá (VNĐ)</label>
            <input
              type="number" id="productPrice" name="price" value={formData.price} onChange={handleChange} step="any"
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 ${errors.price ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-indigo-500'} sm:text-sm`}
              placeholder="VD: 250000"
            />
            {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price}</p>}
          </div>

          <div className="mb-3">
            <label htmlFor="productImageFile" className="block text-sm font-medium text-gray-700 mb-1">
              Ảnh Sản phẩm
            </label>
            <input
              type="file"
              id="productImageFile"
              name="productImageFile"
              accept="image/*"
              onChange={handleFileChange}
              ref={fileInputRef}
              className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-600 hover:file:bg-indigo-100"
            />
            {imagePreviewUrl && (
              <div className="mt-2 relative w-32 h-32">
                <img src={imagePreviewUrl} alt="Xem trước" className="h-full w-full object-cover rounded-md border" />
                <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 w-6 h-6 flex items-center justify-center text-xs leading-none hover:bg-red-600 focus:outline-none"
                    title="Xóa ảnh"
                >
                    ✕
                </button>
              </div>
            )}
            {isUploading && <p className="text-indigo-600 text-xs mt-1">Đang tải ảnh lên...</p>}
          </div>

          <div className="mb-4">
            <label htmlFor="productCategory" className="block text-sm font-medium text-gray-700 mb-1">Danh mục</label>
            <select
              id="productCategory" name="category_id" value={formData.category_id} onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 ${errors.category_id ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-indigo-500'} sm:text-sm`}
            >
              <option value="">-- Chọn danh mục --</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button" onClick={handleClose} disabled={isUploading}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition disabled:opacity-50"
            >Hủy</button>
            <button
              type="submit" disabled={isUploading}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition disabled:opacity-50"
            >{isUploading ? 'Đang xử lý...' : (product ? 'Lưu thay đổi' : 'Thêm mới')}</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ProductModal;