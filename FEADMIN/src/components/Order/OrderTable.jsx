// src/components/Order/OrderTable.jsx
import React from 'react';
import { AiOutlineEye } from 'react-icons/ai';
import { FiEdit3 } from 'react-icons/fi';

function OrderTable({ orders, onViewDetails, onUpdateStatus }) {

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    try {
      const options = { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' };
      return new Intl.DateTimeFormat('vi-VN', options).format(new Date(dateString));
    } catch (e) {
      return 'Invalid Date';
    }
  };

  const getOrderStatusTextAndStyle = (status) => {
    switch (status) {
      case '0': return { text: 'Đang chờ xử lý', style: 'bg-yellow-100 text-yellow-700' };
      case '1': return { text: 'Đã xác nhận', style: 'bg-blue-100 text-blue-700' };
      case '2': return { text: 'Hoàn thành/Đã hủy', style: 'bg-green-100 text-green-700' };
      default: return { text: 'Không xác định', style: 'bg-gray-100 text-gray-700' };
    }
  };
  
  const formatCurrency = (amount) => {
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount)) return 'N/A';
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(numAmount);
  };


  return (
    <div className="overflow-x-auto relative shadow-md sm:rounded-lg bg-white">
      <table className="w-full text-sm text-left text-gray-500">
        <thead className="text-xs text-gray-700 uppercase bg-gray-100">
          <tr>
            <th scope="col" className="py-3 px-6">ID Đơn</th>
            <th scope="col" className="py-3 px-6">Khách hàng</th>
            <th scope="col" className="py-3 px-6">Ngày đặt</th>
            <th scope="col" className="py-3 px-6">Tổng tiền</th>
            <th scope="col" className="py-3 px-6">Trạng thái</th>
            <th scope="col" className="py-3 px-6 text-center">Hành động</th>
          </tr>
        </thead>
        <tbody>
          {orders.length === 0 ? (
            <tr className="bg-white border-b">
              <td colSpan="6" className="py-4 px-6 text-center text-gray-500">
                Không tìm thấy đơn hàng nào.
              </td>
            </tr>
          ) : (
            orders.map((order) => {
              const statusInfo = getOrderStatusTextAndStyle(order.orderstatus);
              return (
                <tr key={order.id} className="bg-white border-b hover:bg-gray-50">
                  <td className="py-4 px-6 font-medium text-gray-900">#{order.id}</td>
                  <td className="py-4 px-6 text-gray-800">{order.customer?.name || 'N/A'}</td>
                  <td className="py-4 px-6">{formatDate(order.orderdate)}</td>
                  {/* Sử dụng trực tiếp order.total_amount từ API */}
                  <td className="py-4 px-6 font-semibold text-indigo-600">{formatCurrency(order.total_amount)}</td>
                  <td className="py-4 px-6">
                    <span className={`px-2 py-1 text-xs rounded-full font-semibold ${statusInfo.style}`}>
                      {statusInfo.text}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-center space-x-2 whitespace-nowrap">
                    <button
                      onClick={() => onViewDetails(order)}
                      className="text-blue-600 hover:text-blue-800 transition duration-150 ease-in-out p-1 rounded hover:bg-blue-100"
                      title="Xem chi tiết đơn hàng"
                    >
                      <AiOutlineEye size={20} />
                    </button>
                    <button
                      onClick={() => onUpdateStatus(order)}
                      className="text-green-600 hover:text-green-800 transition duration-150 ease-in-out p-1 rounded hover:bg-green-100"
                      title="Cập nhật trạng thái"
                    >
                      <FiEdit3 size={18} />
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