// src/components/admin/CategoryModal.js
import React, { useState, useEffect } from 'react';

function CategoryModal({ isOpen, onClose, onSubmit, category }) {
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  // Cập nhật state name khi category prop thay đổi (cho edit mode)
  useEffect(() => {
    
    if (category) {
      setName(category.name);
    } else {
      setName(''); // Reset cho add mode
    }
    setError(''); // Reset lỗi khi mở modal hoặc đổi category
  }, [category, isOpen]); // Chạy lại khi category thay đổi hoặc modal mở

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Tên danh mục không được để trống.');
      return;
    }
    onSubmit({ name }); // Gửi object chứa name lên component cha
    // Việc đóng modal và reset state được thực hiện ở component cha sau khi submit thành công/thất bại
  };

  const handleClose = () => {
      setName(''); // Reset name khi đóng bằng nút cancel
      setError('');
      onClose();
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 transition-opacity duration-300 ease-in-out">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md transform transition-all duration-300 ease-in-out scale-100">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">
          {category ? 'Sửa Danh mục' : 'Thêm Danh mục Mới'}
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="categoryName" className="block text-sm font-medium text-gray-700 mb-1">
              Tên Danh mục <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="categoryName"
              value={name}
              onChange={(e) => {
                  setName(e.target.value);
                  if(error) setError(''); // Xóa lỗi khi user bắt đầu nhập
              }}
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 ${error ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-indigo-500'} sm:text-sm`}
              placeholder="Nhập tên danh mục..."
              required
            />
             {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
          </div>
          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition duration-150 ease-in-out"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out"
            >
              {category ? 'Lưu thay đổi' : 'Thêm mới'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CategoryModal;