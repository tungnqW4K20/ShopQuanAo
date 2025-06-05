import React, { useState, useEffect } from 'react';

function UpdateOrderStatusModal({ isOpen, onClose, onSubmit, order, availableStatuses }) {
  const [selectedStatusApiKey, setSelectedStatusApiKey] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen && order && availableStatuses?.length > 0) {
      // Find the apiKey corresponding to the order's current modelValue
      const currentStatusObj = availableStatuses.find(s => s.modelValue === String(order.orderstatus));
      setSelectedStatusApiKey(currentStatusObj?.apiKey || ''); // Set current status apiKey as default
      setError('');
    }
  }, [isOpen, order, availableStatuses]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedStatusApiKey) {
      setError('Vui lòng chọn một trạng thái.');
      return;
    }
    onSubmit(order.id, selectedStatusApiKey);
  };

  const handleClose = () => {
    setError('');
    onClose();
  };

  if (!isOpen || !order) return null;

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
              value={selectedStatusApiKey}
              onChange={(e) => {
                setSelectedStatusApiKey(e.target.value);
                if (error) setError('');
              }}
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 ${
                error ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-indigo-500'
              } sm:text-sm`}
            >
              <option value="" disabled>Chọn trạng thái...</option>
              {availableStatuses && availableStatuses.map(status => (
                <option key={status.apiKey} value={status.apiKey}>
                  {status.description} ({status.apiKey})
                </option>
              ))}
            </select>
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
              Lưu thay đổi
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default UpdateOrderStatusModal;