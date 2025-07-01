import React from 'react';

function CompleteInvoiceConfirmModal({ isOpen, onClose, onConfirm, invoiceId, isCompleting }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Xác nhận Hoàn thành Hóa đơn</h2>
        <p className="mb-6 text-gray-600">
          Bạn có chắc chắn muốn hoàn thành hóa đơn nhập hàng <strong>#{invoiceId}</strong>?
          <br />
          Hành động này sẽ cập nhật số lượng tồn kho và không thể hoàn tác.
        </p>
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isCompleting}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 disabled:opacity-50"
          >
            Hủy
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isCompleting}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-wait"
          >
            {isCompleting ? 'Đang xử lý...' : 'Xác nhận'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default CompleteInvoiceConfirmModal;