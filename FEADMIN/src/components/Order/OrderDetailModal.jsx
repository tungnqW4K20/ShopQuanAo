import React from 'react';
import { formatDate, formatCurrency, getOrderStatusInfo } from '../../utils/formatting';
import { AiOutlineClose } from 'react-icons/ai';

function OrderDetailsModal({ isOpen, onClose, order, orderStatuses }) {
  if (!isOpen || !order) return null;

  const calculateTotalAmount = (orderDetails) => {
    if (!orderDetails || orderDetails.length === 0) return 0;
    return orderDetails.reduce((sum, item) => sum + (parseFloat(item.price) * item.quantity), 0);
  };

  const totalAmount = calculateTotalAmount(order.orderDetails);
  const statusInfo = getOrderStatusInfo(order.orderstatus, orderStatuses);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 p-4 transition-opacity duration-300 ease-in-out">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] transform transition-all duration-300 ease-in-out scale-100">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-semibold text-gray-800">
            Chi tiết Đơn hàng #{order.id}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <AiOutlineClose size={24} />
          </button>
        </div>

        <div className="p-6 space-y-4 overflow-y-auto" style={{maxHeight: 'calc(90vh - 140px)'}}> 
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <h3 className="text-md font-semibold text-gray-700 mb-1">Thông tin Khách hàng</h3>
              <p><strong>Tên:</strong> {order.customer?.name || 'N/A'}</p>
              <p><strong>Email:</strong> {order.customer?.email || 'N/A'}</p>
            </div>
            <div>
              <h3 className="text-md font-semibold text-gray-700 mb-1">Thông tin Đơn hàng</h3>
              <p><strong>Ngày đặt:</strong> {formatDate(order.orderdate)}</p>
              <p><strong>Trạng thái:</strong> <span className={statusInfo.className}>{statusInfo.text}</span></p>
              <p><strong>Tổng tiền:</strong> <span className="font-bold text-indigo-600">{formatCurrency(totalAmount)}</span></p>
            </div>
          </div>

          <h3 className="text-md font-semibold text-gray-700 mb-2">Chi tiết Sản phẩm</h3>
          {order.orderDetails && order.orderDetails.length > 0 ? (
            <ul className="divide-y divide-gray-200">
              {order.orderDetails.map(item => (
                <li key={item.id} className="py-3 flex space-x-4">
                  <img
                    src={item.image_url || 'https://via.placeholder.com/80?text=No+Image'}
                    alt={item.product?.name}
                    className="w-20 h-20 object-cover rounded"
                  />
                  <div className="flex-1">
                    <p className="font-semibold text-gray-800">{item.product?.name || 'Sản phẩm không tên'}</p>
                    <p className="text-sm text-gray-500">
                      Màu: {item.colorVariant?.name || 'N/A'}, Kích thước: {item.sizeVariant?.name || 'N/A'}
                    </p>
                    <p className="text-sm text-gray-500">
                      Số lượng: {item.quantity} x {formatCurrency(item.price)}
                    </p>
                  </div>
                  <p className="text-sm font-semibold text-gray-700">
                    {formatCurrency(item.quantity * parseFloat(item.price))}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">Không có sản phẩm nào trong đơn hàng này.</p>
          )}
        </div>
        <div className="p-4 border-t flex justify-end">
            <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition duration-150 ease-in-out"
            >
                Đóng
            </button>
        </div>
      </div>
    </div>
  );
}

export default OrderDetailsModal;