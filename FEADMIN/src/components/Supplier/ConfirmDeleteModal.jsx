// src/components/Shared/ConfirmDeleteModal.js (or wherever your shared modals are)
// This is a slightly modified version of your Category's ConfirmDeleteModal
import React from 'react';

function ConfirmDeleteModal({ isOpen, onClose, onConfirm, itemName, itemType = "mục" }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-sm mx-auto">
        <h3 className="text-lg font-medium leading-6 text-gray-900">
          Xác nhận Xóa {itemType}
        </h3>
        <div className="mt-2">
          <p className="text-sm text-gray-500">
            Bạn có chắc chắn muốn xóa {itemType} "{itemName}" không? Hành động này không thể hoàn tác.
          </p>
        </div>
        <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
          <button
            type="button"
            className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:col-start-2 sm:text-sm"
            onClick={onConfirm}
          >
            Xóa
          </button>
          <button
            type="button"
            className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:col-start-1 sm:text-sm"
            onClick={onClose}
          >
            Hủy
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmDeleteModal;