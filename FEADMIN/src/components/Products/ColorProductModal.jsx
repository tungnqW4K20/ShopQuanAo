import React, { useState, useEffect } from 'react';

function ColorProductModal({ isOpen, onClose, onSubmit, colorProduct, productId }) {
  const initialFormData = {
    name: '',
    price: '',
    description: '',
    image_urls: [],
    product_id: productId || '',
  };
  const [formData, setFormData] = useState(initialFormData);
  const [currentImageUrl, setCurrentImageUrl] = useState('');
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isOpen) {
      if (colorProduct) {
        setFormData({
          name: colorProduct.name || '',
          price: colorProduct.price !== null && colorProduct.price !== undefined ? String(colorProduct.price) : '',
          description: colorProduct.description || '',
          image_urls: colorProduct.image_urls || [],
          product_id: colorProduct.product_id || productId,
        });
      } else {
        // For new color product, ensure product_id is passed
        setFormData({ ...initialFormData, product_id: productId });
      }
      setCurrentImageUrl('');
      setErrors({});
    }
  }, [colorProduct, isOpen, productId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleImageUrlChange = (e) => {
    setCurrentImageUrl(e.target.value);
  };

  const handleAddImageUrl = () => {
    if (currentImageUrl.trim() && formData.image_urls.length < 7) {
        if (!/^(ftp|http|https):\/\/[^ "]+$/.test(currentImageUrl.trim())) {
            setErrors(prev => ({...prev, image_urls: 'Link ảnh không hợp lệ.'}));
            return;
        }
        setFormData((prev) => ({
            ...prev,
            image_urls: [...prev.image_urls, currentImageUrl.trim()],
        }));
        setCurrentImageUrl('');
        setErrors(prev => ({...prev, image_urls: ''})); // Clear error on successful add
    } else if (formData.image_urls.length >= 7) {
        setErrors(prev => ({...prev, image_urls: 'Tối đa 7 ảnh.'}));
    }
  };

  const handleRemoveImageUrl = (index) => {
    setFormData((prev) => ({
      ...prev,
      image_urls: prev.image_urls.filter((_, i) => i !== index),
    }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Tên màu không được để trống.';
    if (formData.price.trim() && isNaN(parseFloat(formData.price))) {
      newErrors.price = 'Giá phải là một số.';
    } else if (formData.price.trim() && parseFloat(formData.price) < 0) {
      newErrors.price = 'Giá không được âm.';
    }
    if (formData.image_urls.length > 7) {
        newErrors.image_urls = 'Tối đa 7 ảnh.';
    }
    formData.image_urls.forEach(url => {
        if (!/^(ftp|http|https):\/\/[^ "]+$/.test(url)) {
            newErrors.image_urls = 'Một hoặc nhiều link ảnh không hợp lệ.';
        }
    });

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
          {colorProduct ? 'Sửa Biến Thể Màu' : 'Thêm Biến Thể Màu'}
        </h2>
        <form onSubmit={handleSubmit} noValidate>
          {/* Product ID (hidden, for context) */}
          <input type="hidden" name="product_id" value={formData.product_id} />

          {/* Color Name */}
          <div className="mb-3">
            <label htmlFor="colorProductName" className="block text-sm font-medium text-gray-700 mb-1">
              Tên Màu <span className="text-red-500">*</span>
            </label>
            <input
              type="text" id="colorProductName" name="name" value={formData.name} onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 ${errors.name ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-indigo-500'}`}
              placeholder="VD: Đỏ, Xanh Dương"
            />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
          </div>

          {/* Price Adjustment */}
          <div className="mb-3">
            <label htmlFor="colorProductPrice" className="block text-sm font-medium text-gray-700 mb-1">
              Điều chỉnh giá (VNĐ)
            </label>
            <input
              type="number" id="colorProductPrice" name="price" value={formData.price} onChange={handleChange} step="any"
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 ${errors.price ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-indigo-500'}`}
              placeholder="Để trống nếu không điều chỉnh"
            />
            {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price}</p>}
          </div>

          {/* Description */}
          <div className="mb-3">
            <label htmlFor="colorProductDescription" className="block text-sm font-medium text-gray-700 mb-1">
              Mô tả cho màu này
            </label>
            <textarea
              id="colorProductDescription" name="description" value={formData.description} onChange={handleChange} rows="2"
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 ${errors.description ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-indigo-500'}`}
              placeholder="Mô tả thêm (nếu có)..."
            ></textarea>
            {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
          </div>

          {/* Image URLs */}
          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700 mb-1">Link Ảnh (tối đa 7)</label>
            <div className="flex items-center mb-2">
              <input
                type="url" value={currentImageUrl} onChange={handleImageUrlChange}
                className={`flex-grow px-3 py-2 border rounded-l-md shadow-sm focus:outline-none focus:ring-2 ${errors.image_urls ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-indigo-500'}`}
                placeholder="https://example.com/image.jpg"
              />
              <button
                type="button" onClick={handleAddImageUrl}
                className="px-3 py-2 bg-gray-200 text-gray-700 rounded-r-md hover:bg-gray-300"
                disabled={formData.image_urls.length >= 7}
              >Thêm</button>
            </div>
            {errors.image_urls && <p className="text-red-500 text-xs mt-1 mb-1">{errors.image_urls}</p>}
            <div className="space-y-1">
              {formData.image_urls.map((url, index) => (
                <div key={index} className="flex items-center justify-between text-xs p-1 bg-gray-100 rounded">
                  <span className="truncate w-5/6">{url}</span>
                  <button
                    type="button" onClick={() => handleRemoveImageUrl(index)}
                    className="text-red-500 hover:text-red-700 ml-2"
                  >Xóa</button>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">Hủy</button>
            <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">
              {colorProduct ? 'Lưu thay đổi' : 'Thêm Biến Thể'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ColorProductModal;