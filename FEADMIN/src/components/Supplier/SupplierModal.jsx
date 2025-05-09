// src/components/Supplier/SupplierModal.js
import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

function SupplierModal({ isOpen, onClose, onSubmit, supplier }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phonenumber, setPhonenumber] = useState('');
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (supplier) {
      setName(supplier.name || '');
      setEmail(supplier.email || '');
      setPhonenumber(supplier.phonenumber || '');
    } else {
      setName('');
      setEmail('');
      setPhonenumber('');
    }
    setErrors({}); // Reset errors when supplier changes or modal opens
  }, [supplier, isOpen]);

  const validateForm = () => {
    const newErrors = {};
    if (!name.trim()) newErrors.name = 'Tên nhà cung cấp không được để trống.';
    if (!email.trim()) {
        newErrors.email = 'Email không được để trống.';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
        newErrors.email = 'Email không hợp lệ.';
    }
    if (!phonenumber.trim()) {
        newErrors.phonenumber = 'Số điện thoại không được để trống.';
    } else if (!/^\d{10,11}$/.test(phonenumber)) { // Basic phone number validation (e.g., 10-11 digits)
        newErrors.phonenumber = 'Số điện thoại không hợp lệ (cần 10-11 chữ số).';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.warn("Vui lòng kiểm tra lại thông tin đã nhập.");
      return;
    }
    onSubmit({ name, email, phonenumber });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex justify-center items-center">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md mx-auto">
        <h2 className="text-2xl font-semibold mb-6 text-gray-800">
          {supplier ? 'Chỉnh sửa Nhà Cung Cấp' : 'Thêm Nhà Cung Cấp Mới'}
        </h2>
        <form onSubmit={handleSubmit} noValidate>
          <div className="mb-4">
            <label htmlFor="supplierName" className="block text-sm font-medium text-gray-700 mb-1">
              Tên Nhà Cung Cấp <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="supplierName"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={`mt-1 block w-full px-3 py-2 border ${errors.name ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
              required
            />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
          </div>

          <div className="mb-4">
            <label htmlFor="supplierEmail" className="block text-sm font-medium text-gray-700 mb-1">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              id="supplierEmail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`mt-1 block w-full px-3 py-2 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
              required
            />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
          </div>

          <div className="mb-6">
            <label htmlFor="supplierPhone" className="block text-sm font-medium text-gray-700 mb-1">
              Số Điện Thoại <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              id="supplierPhone"
              value={phonenumber}
              onChange={(e) => setPhonenumber(e.target.value)}
              className={`mt-1 block w-full px-3 py-2 border ${errors.phonenumber ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
              required
            />
            {errors.phonenumber && <p className="text-red-500 text-xs mt-1">{errors.phonenumber}</p>}
          </div>

          <div className="flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md border border-gray-300 transition duration-150"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150"
            >
              {supplier ? 'Lưu Thay Đổi' : 'Thêm Mới'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default SupplierModal;