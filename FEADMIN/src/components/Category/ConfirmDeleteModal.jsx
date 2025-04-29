// src/components/admin/ConfirmDeleteModal.js
import React from 'react';

function ConfirmDeleteModal({ isOpen, onClose, onConfirm, itemName, itemType = 'mục' }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 transition-opacity duration-300 ease-in-out">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md transform transition-all duration-300 ease-in-out scale-100">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Xác nhận Xóa</h2>
        <p className="text-gray-600 mb-6">
          Bạn có chắc chắn muốn xóa {itemType} này không?
          {itemName && <strong className="text-gray-800"> "{itemName}"</strong>}
          <br/>
          Hành động này không thể hoàn tác.
        </p>
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition duration-150 ease-in-out"
          >
            Hủy
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition duration-150 ease-in-out"
          >
            Xác nhận Xóa
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmDeleteModal;