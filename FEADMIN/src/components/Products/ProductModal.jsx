import React, { useState, useEffect } from 'react';

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
      } else {
        setFormData(initialFormData);
      }
      setErrors({});
    }
  }, [product, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
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
    // Basic URL validation (optional, can be more robust)
    if (formData.image_url.trim() && !/^(ftp|http|https):\/\/[^ "]+$/.test(formData.image_url.trim())) {
        newErrors.image_url = 'Link ảnh không hợp lệ.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const dataToSubmit = {
      ...formData,
      price: formData.price.trim() ? parseFloat(formData.price) : null,
      category_id: formData.category_id ? parseInt(formData.category_id, 10) : null,
      image_url: formData.image_url.trim() ? formData.image_url.trim() : null,
    };
    onSubmit(dataToSubmit);
  };

  const handleClose = () => {
    setFormData(initialFormData);
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 transition-opacity duration-300 ease-in-out">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-lg transform transition-all duration-300 ease-in-out scale-100 max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">
          {product ? 'Sửa Sản phẩm' : 'Thêm Sản phẩm Mới'}
        </h2>
        <form onSubmit={handleSubmit} noValidate>
          {/* Name */}
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

          {/* Description */}
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

          {/* Price */}
          <div className="mb-3">
            <label htmlFor="productPrice" className="block text-sm font-medium text-gray-700 mb-1">Giá (VNĐ)</label>
            <input
              type="number" id="productPrice" name="price" value={formData.price} onChange={handleChange} step="any"
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 ${errors.price ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-indigo-500'} sm:text-sm`}
              placeholder="VD: 250000"
            />
            {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price}</p>}
          </div>

          {/* Image URL */}
          <div className="mb-3">
            <label htmlFor="productImageUrl" className="block text-sm font-medium text-gray-700 mb-1">Link Ảnh</label>
            <input
              type="url" id="productImageUrl" name="image_url" value={formData.image_url} onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 ${errors.image_url ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-indigo-500'} sm:text-sm`}
              placeholder="https://example.com/image.jpg"
            />
            {errors.image_url && <p className="text-red-500 text-xs mt-1">{errors.image_url}</p>}
          </div>

          {/* Category */}
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
            {errors.category_id && <p className="text-red-500 text-xs mt-1">{errors.category_id}</p>}
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button" onClick={handleClose}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition"
            >Hủy</button>
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition"
            >{product ? 'Lưu thay đổi' : 'Thêm mới'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ProductModal;