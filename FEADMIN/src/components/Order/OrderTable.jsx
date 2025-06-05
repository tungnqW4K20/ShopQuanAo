import React from 'react';
import { AiOutlineEye, AiOutlineEdit } from 'react-icons/ai';
import { formatDate, formatCurrency, getOrderStatusInfo } from '../../utils/formatting';

function OrderTable({ orders, orderStatuses, onOpenDetailsModal, onOpenUpdateStatusModal, loading }) {
  const calculateTotalAmount = (orderDetails) => {
    if (!orderDetails || orderDetails.length === 0) return 0;
    return orderDetails.reduce((sum, item) => sum + (parseFloat(item.price) * item.quantity), 0);
  };

  if (loading) {
    return <p className="text-center text-gray-500 py-4">Đang tải danh sách đơn hàng...</p>;
  }

  return (
    <div className="overflow-x-auto relative shadow-md sm:rounded-lg bg-white">
      <table className="w-full text-sm text-left text-gray-500">
        <thead className="text-xs text-gray-700 uppercase bg-gray-100">
          <tr>
            <th scope="col" className="py-3 px-6">ID Đơn</th>
            <th scope="col" className="py-3 px-6">Khách hàng</th>
            <th scope="col" className="py-3 px-6">Email</th>
            <th scope="col" className="py-3 px-6">Ngày đặt</th>
            <th scope="col" className="py-3 px-6">Tổng tiền</th>
            <th scope="col" className="py-3 px-6">Trạng thái</th>
            <th scope="col" className="py-3 px-6 text-right">Hành động</th>
          </tr>
        </thead>
        <tbody>
          {orders.length === 0 ? (
            <tr className="bg-white border-b">
              <td colSpan="7" className="py-4 px-6 text-center text-gray-500">
                Không tìm thấy đơn hàng nào.
              </td>
            </tr>
          ) : (
            orders.map((order) => {
              const statusInfo = getOrderStatusInfo(order.orderstatus, orderStatuses);
              const totalAmount = calculateTotalAmount(order.orderDetails);
              return (
                <tr key={order.id} className="bg-white border-b hover:bg-gray-50">
                  <td className="py-4 px-6 font-medium text-gray-900 whitespace-nowrap">
                    #{order.id}
                  </td>
                  <td className="py-4 px-6 text-gray-800">
                    {order.customer?.name || 'N/A'}
                  </td>
                  <td className="py-4 px-6">
                    {order.customer?.email || 'N/A'}
                  </td>
                  <td className="py-4 px-6">
                    {formatDate(order.orderdate)}
                  </td>
                  <td className="py-4 px-6 font-semibold text-gray-800">
                    {formatCurrency(totalAmount)}
                  </td>
                  <td className="py-4 px-6">
                    <span className={statusInfo.className}>
                      {statusInfo.text}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right space-x-2 whitespace-nowrap">
                    <button
                      onClick={() => onOpenDetailsModal(order)}
                      className="font-medium text-blue-600 hover:text-blue-800 transition duration-150 ease-in-out p-1 rounded hover:bg-blue-100"
                      title="Xem chi tiết"
                    >
                      <AiOutlineEye size={18} />
                    </button>
                    <button
                      onClick={() => onOpenUpdateStatusModal(order)}
                      className="font-medium text-indigo-600 hover:text-indigo-800 transition duration-150 ease-in-out p-1 rounded hover:bg-indigo-100"
                      title="Cập nhật trạng thái"
                    >
                      <AiOutlineEdit size={18} />
                    </button>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}

export default OrderTable;