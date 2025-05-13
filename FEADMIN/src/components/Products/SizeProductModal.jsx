import React, { useState, useEffect } from 'react';

function SizeProductModal({ isOpen, onClose, onSubmit, sizeProduct, productId }) {
  const initialFormData = {
    name: '',
    price: '', 
    description: '',
    product_id: productId || '',
  };
  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isOpen) {
      if (sizeProduct) {
        setFormData({
          name: sizeProduct.name || '',
          price: sizeProduct.price !== null && sizeProduct.price !== undefined ? String(sizeProduct.price) : '',
          description: sizeProduct.description || '',
          product_id: sizeProduct.product_id || productId,
        });
      } else {
        setFormData({ ...initialFormData, product_id: productId });
      }
      setErrors({});
    }
  }, [sizeProduct, isOpen, productId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Tên kích thước không được để trống.';
    if (formData.price.trim() && isNaN(parseFloat(formData.price))) {
      newErrors.price = 'Giá phải là một số.';
    } else if (formData.price.trim() && parseFloat(formData.price) < 0) {
      newErrors.price = 'Giá không được âm.';
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
      description: formData.description.trim() ? formData.description.trim() : null,
    };
    onSubmit(dataToSubmit);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md transform max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">
          {sizeProduct ? 'Sửa Biến Thể Kích Thước' : 'Thêm Biến Thể Kích Thước'}
        </h2>
        <form onSubmit={handleSubmit} noValidate>
          <input type="hidden" name="product_id" value={formData.product_id} />

          {/* Size Name */}
          <div className="mb-3">
            <label htmlFor="sizeProductName" className="block text-sm font-medium text-gray-700 mb-1">
              Tên Kích Thước <span className="text-red-500">*</span>
            </label>
            <input
              type="text" id="sizeProductName" name="name" value={formData.name} onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 ${errors.name ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-indigo-500'}`}
              placeholder="VD: S, M, L, XL"
            />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
          </div>

          {/* Price Adjustment */}
          <div className="mb-3">
            <label htmlFor="sizeProductPrice" className="block text-sm font-medium text-gray-700 mb-1">
              Điều chỉnh giá (VNĐ)
            </label>
            <input
              type="number" id="sizeProductPrice" name="price" value={formData.price} onChange={handleChange} step="any"
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 ${errors.price ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-indigo-500'}`}
              placeholder="Để trống nếu không điều chỉnh"
            />
            {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price}</p>}
          </div>

          {/* Description */}
          <div className="mb-3">
            <label htmlFor="sizeProductDescription" className="block text-sm font-medium text-gray-700 mb-1">
              Mô tả cho kích thước này
            </label>
            <textarea
              id="sizeProductDescription" name="description" value={formData.description} onChange={handleChange} rows="2"
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 ${errors.description ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-indigo-500'}`}
              placeholder="Mô tả thêm (nếu có)..."
            ></textarea>
            {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">Hủy</button>
            <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">
              {sizeProduct ? 'Lưu thay đổi' : 'Thêm Biến Thể'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default SizeProductModal;