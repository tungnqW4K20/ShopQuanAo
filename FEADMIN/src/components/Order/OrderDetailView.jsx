// src/components/Order/OrderDetailView.jsx
import React from 'react';

function OrderDetailView({ order, loading, error }) { // Props loading và error sẽ từ component cha truyền vào nếu cần

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
      return new Intl.DateTimeFormat('vi-VN', options).format(new Date(dateString));
    } catch (e) {
      return 'Ngày không hợp lệ';
    }
  };

  const getOrderStatusText = (status) => {
    switch (status) {
      case '0': return 'Đang chờ xử lý';
      case '1': return 'Đã xác nhận / Đang xử lý';
      case '2': return 'Đã giao / Hoàn thành / Đã hủy';
      default: return 'Không xác định';
    }
  };

  const formatCurrency = (amount) => {
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount)) return 'N/A';
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(numAmount);
  };

  // Xử lý loading và error từ component cha (ví dụ: ManageOrdersPage hoặc ViewOrderPage)
  if (loading) {
    return <div className="text-center p-10">Đang tải chi tiết đơn hàng...</div>;
  }

  if (error) {
    return <div className="text-center p-10 text-red-500">Lỗi: {error}</div>;
  }

  if (!order || Object.keys(order).length === 0) { // Kiểm tra order có dữ liệu không
    return <div className="text-center p-10">Không có dữ liệu đơn hàng để hiển thị.</div>;
  }
  
  // Tính tổng tiền. API của bạn có vẻ trả về total_amount trong service rồi,
  // nhưng nếu không, chúng ta có thể tính lại ở đây.
  const totalAmount = order.total_amount !== undefined 
    ? order.total_amount
    : order.orderDetails?.reduce((sum, item) => sum + (parseFloat(item.price) * item.quantity), 0) || 0;

  return (
    // ... (Phần JSX hiển thị giữ nguyên như trước) ...
    <div className="bg-white shadow-xl rounded-lg p-6 md:p-8"> {/* Bỏ max-w-4xl mx-auto my-8 nếu dùng trong modal */}
      <div className="flex flex-col sm:flex-row justify-between items-start mb-6 pb-4 border-b border-gray-200">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-indigo-700">Chi tiết Đơn hàng #{order.id}</h1>
          <p className="text-sm text-gray-500">Ngày đặt: {formatDate(order.orderdate)}</p>
        </div>
        <div className="mt-3 sm:mt-0 text-sm sm:text-right">
            <span 
                className={`px-3 py-1 rounded-full font-semibold
                    ${order.orderstatus === '0' ? 'bg-yellow-100 text-yellow-700' : ''}
                    ${order.orderstatus === '1' ? 'bg-blue-100 text-blue-700' : ''}
                    ${order.orderstatus === '2' ? 'bg-green-100 text-green-700' : ''}
                `}
            >
                {getOrderStatusText(order.orderstatus)}
            </span>
        </div>
      </div>

      {/* Thông tin khách hàng */}
      <div className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gray-50 p-4 rounded-lg">
          <h2 className="text-lg font-semibold text-gray-700 mb-2">Thông tin Khách hàng</h2>
          <p><strong>Tên:</strong> {order.customer?.name || 'N/A'}</p>
          <p><strong>Email:</strong> {order.customer?.email || 'N/A'}</p>
          <p><strong>Địa chỉ:</strong> {order.customer?.address || 'N/A'}</p>
        </div>
         <div className="bg-gray-50 p-4 rounded-lg">
          <h2 className="text-lg font-semibold text-gray-700 mb-2">Tổng quan Đơn hàng</h2>
          <p><strong>ID Đơn hàng:</strong> {order.id}</p>
          <p><strong>Ngày tạo:</strong> {formatDate(order.createdAt)}</p>
          <p><strong>Cập nhật lần cuối:</strong> {formatDate(order.updatedAt)}</p>
        </div>
      </div>
      
      {/* Chi tiết sản phẩm */}
      <div>
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Sản phẩm trong Đơn hàng</h2>
        {order.orderDetails && order.orderDetails.length > 0 ? (
          <div className="space-y-4">
            {order.orderDetails.map((item, index) => (
              <div key={item.id || index} className="flex flex-col sm:flex-row items-start sm:items-center p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                <img
                  src={item.product?.image_url || item.colorVariant?.image_urls?.[0] || 'https://via.placeholder.com/80'}
                  alt={item.product?.name}
                  className="w-20 h-20 object-cover rounded-md mr-0 mb-3 sm:mr-4 sm:mb-0"
                />
                <div className="flex-grow">
                  <h3 className="text-md font-semibold text-indigo-600">{item.product?.name || 'Sản phẩm không xác định'}</h3>
                  <p className="text-xs text-gray-500">Mã SP: {item.products_id}</p>
                  <p className="text-sm text-gray-600">
                    Màu: {item.colorVariant?.name || 'N/A'} | Kích thước: {item.sizeVariant?.name || 'N/A'}
                  </p>
                </div>
                <div className="text-sm text-gray-700 mt-2 sm:mt-0 sm:text-right">
                  <p>Số lượng: {item.quantity}</p>
                  <p>Đơn giá: {formatCurrency(item.price)}</p>
                  <p className="font-semibold">Thành tiền: {formatCurrency(parseFloat(item.price) * item.quantity)}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">Không có sản phẩm nào trong đơn hàng này.</p>
        )}
      </div>

      {/* Tổng tiền */}
      <div className="mt-8 pt-6 border-t border-gray-300 text-right">
        <p className="text-lg font-semibold text-gray-700">
          Tổng cộng: <span className="text-2xl text-indigo-700 font-bold">{formatCurrency(totalAmount)}</span>
        </p>
      </div>
    </div>
  );
}

export default OrderDetailView;