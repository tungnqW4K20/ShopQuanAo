// src/components/Order/UpdateOrderStatusModal.jsx
import React, { useState, useEffect } from 'react';

function UpdateOrderStatusModal({ isOpen, onClose, onSubmit, order }) {
  const [currentStatus, setCurrentStatus] = useState('');

  useEffect(() => {
    if (order) {
      setCurrentStatus(order.orderstatus);
    } else {
      setCurrentStatus('');
    }
  }, [order, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (currentStatus === order?.orderstatus) {
      onClose(); // Không có gì thay đổi
      return;
    }
    onSubmit(currentStatus);
  };

  const handleClose = () => {
    onClose();
  };

  if (!isOpen || !order) return null;

  const orderStatusOptions = [
    { value: '0', label: 'Đang chờ xử lý' },
    { value: '1', label: 'Đã xác nhận / Đang xử lý' },
    { value: '2', label: 'Hoàn thành / Đã hủy' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 transition-opacity duration-300 ease-in-out">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md transform transition-all duration-300 ease-in-out scale-100">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">
          Cập nhật Trạng thái Đơn hàng #{order.id}
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="orderStatus" className="block text-sm font-medium text-gray-700 mb-1">
              Trạng thái mới <span className="text-red-500">*</span>
            </label>
            <select
              id="orderStatus"
              value={currentStatus}
              onChange={(e) => setCurrentStatus(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 sm:text-sm"
              required
            >
              <option value="" disabled>Chọn trạng thái</option>
              {orderStatusOptions.map(opt => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={currentStatus === order.orderstatus} // Disable nếu không thay đổi
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              Lưu thay đổi
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default UpdateOrderStatusModal;