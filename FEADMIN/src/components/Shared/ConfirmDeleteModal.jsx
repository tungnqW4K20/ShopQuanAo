import React from 'react';
import { FaExclamationTriangle, FaTrash, FaUndo } from 'react-icons/fa';

function ConfirmDeleteModal({
  isOpen,
  onClose,
  onConfirm,
  itemName,
  itemType = 'mục', // e.g., "danh mục", "sản phẩm", "biến thể màu"
  actionType = 'xóa', // e.g., "xóa", "xóa mềm", "xóa vĩnh viễn", "khôi phục"
  isRestore = false // Special flag if this modal is used for restore confirmation
}) {
  if (!isOpen) return null;

  const getActionVerb = () => {
    if (isRestore) return 'Khôi phục';
    if (actionType.toLowerCase().includes('mềm')) return 'Xóa mềm';
    if (actionType.toLowerCase().includes('vĩnh viễn')) return 'Xóa vĩnh viễn';
    return 'Xóa';
  }

  const actionVerb = getActionVerb();
  const title = isRestore ? `Xác nhận Khôi Phục` : `Xác nhận ${actionType === 'xóa' ? 'Xóa' : actionType.charAt(0).toUpperCase() + actionType.slice(1)}`;
  const message = isRestore
    ? `Bạn có chắc chắn muốn khôi phục ${itemType} "${itemName}" không?`
    : `Bạn có chắc chắn muốn ${actionType.toLowerCase()} ${itemType} "${itemName}" không? Hành động này có thể không thể hoàn tác.`;


  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black bg-opacity-60 transition-opacity duration-300 ease-in-out">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md transform transition-all duration-300 ease-in-out scale-100">
        <div className="flex items-start">
          <div className={`mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full ${isRestore ? 'bg-green-100' : 'bg-red-100'} sm:mx-0 sm:h-10 sm:w-10`}>
            {isRestore ? (
              <FaUndo className="h-6 w-6 text-green-600" aria-hidden="true" />
            ) : (
              <FaExclamationTriangle className="h-6 w-6 text-red-600" aria-hidden="true" />
            )}
          </div>
          <div className="ml-4 mt-0 text-left">
            <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
              {title}
            </h3>
            <div className="mt-2">
              <p className="text-sm text-gray-500">
                {message}
              </p>
            </div>
          </div>
        </div>
        <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse space-y-2 sm:space-y-0 sm:space-x-3 sm:space-x-reverse">
          <button
            type="button"
            className={`w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 text-base font-medium text-white sm:w-auto sm:text-sm
                        ${isRestore ? 'bg-green-600 hover:bg-green-700 focus:ring-green-500'
                                   : 'bg-red-600 hover:bg-red-700 focus:ring-red-500'
                        } 
                        focus:outline-none focus:ring-2 focus:ring-offset-2`}
            onClick={onConfirm}
          >
            {actionVerb}
          </button>
          <button
            type="button"
            className="w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 sm:w-auto sm:text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
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