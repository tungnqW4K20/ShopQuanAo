import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { CheckCircleIcon } from '@heroicons/react/24/solid';
import { useCart } from '../../context/CartContext'; // Import useCart

// --- Helper Functions ---
const formatPrice = (value) => {
  if (value === null || value === undefined) return '0đ';
  return Number(value).toLocaleString('vi-VN') + 'đ';
};
const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
  return new Date(dateString).toLocaleDateString('vi-VN', options);
};
const getPaymentMethodName = (id) => {
  const methods = { cod: 'Thanh toán khi nhận hàng (COD)', momo: 'Ví MoMo', zalopay: 'ZaloPay', vnpay: 'VNPAY' };
  return methods[id] || 'Không xác định';
};

// --- Component ---
function OrderConfirmationNotAuthenPage() {
  const [order, setOrder] = useState(null);
  const [isDataValid, setIsDataValid] = useState(false); // Cờ để kiểm tra dữ liệu có hợp lệ không
  
  const location = useLocation();
  const navigate = useNavigate();
  const { clearCart } = useCart(); // Lấy hàm clearCart từ context

  useEffect(() => {
    const guestOrderData = location.state?.guestOrder;

    // Chỉ hiển thị chi tiết nếu có dữ liệu được truyền qua
    if (guestOrderData && guestOrderData.items && guestOrderData.items.length > 0) {
      const formattedOrder = {
        id: `KH-${Date.now().toString().slice(-6)}`, // Tạo mã đơn hàng tạm
        createdAt: guestOrderData.createdAt,
        status: 'pending',
        total_price: guestOrderData.total,
        shipping_fee: guestOrderData.shipping_fee,
        discount: guestOrderData.discount,
        payment_method: guestOrderData.payment_method,
        customer: guestOrderData.customer,
        items: guestOrderData.items,
      };
      setOrder(formattedOrder);
      setIsDataValid(true);
    } else {
      // Nếu người dùng F5 hoặc truy cập trực tiếp, state sẽ mất
      setIsDataValid(false);
    }
  }, [location.state]);

  const handleClearCartAndContinue = () => {
    if (window.confirm("Bạn có chắc chắn muốn xóa giỏ hàng và quay về trang chủ?")) {
      clearCart();
      alert("Giỏ hàng của bạn đã được xóa.");
      navigate("/");
    }
  };

  // ---- RENDER LOGIC ----

  // Trường hợp người dùng F5 trang hoặc truy cập trực tiếp
  if (!isDataValid) {
    return (
      <div className="bg-gray-50 min-h-screen py-12 px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-3xl mx-auto">
          <CheckCircleIcon className="h-12 w-12 text-green-500 mx-auto" />
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900">
            Đặt Hàng Thành Công!
          </h1>
          <p className="mt-2 text-gray-600">
            Cảm ơn bạn đã mua sắm. Đơn hàng của bạn đang được xử lý.
          </p>
          <div className="mt-10">
            <Link 
              to="/" 
              className="w-full sm:w-auto text-center px-6 py-2.5 border border-transparent rounded-md text-sm font-medium text-white bg-gray-800 hover:bg-gray-700 transition"
            >
              Tiếp tục mua sắm
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Trường hợp có đủ dữ liệu để hiển thị
  const subtotal = order.items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="bg-gray-50 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center">
          <CheckCircleIcon className="h-12 w-12 text-green-500 mx-auto" />
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900">Đặt Hàng Thành Công!</h1>
          <p className="mt-2 text-gray-600">
            Cảm ơn bạn. Đây là thông tin chi tiết đơn hàng của bạn.
          </p>
        </div>

        <div className="mt-10 space-y-8">
          <section className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-lg font-semibold border-b pb-3 mb-4">Tổng quan đơn hàng</h2>
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between"><dt className="text-gray-600">Mã đơn hàng:</dt><dd className="font-semibold">{order.id}</dd></div>
              <div className="flex justify-between"><dt className="text-gray-600">Ngày đặt:</dt><dd>{formatDate(order.createdAt)}</dd></div>
              <div className="flex justify-between"><dt className="text-gray-600">Tổng tiền:</dt><dd className="font-semibold text-indigo-600">{formatPrice(order.total_price)}</dd></div>
            </dl>
          </section>

          <section className="bg-white rounded-lg shadow-sm">
            <h2 className="text-lg font-semibold p-6 border-b">Chi tiết sản phẩm</h2>
            <ul role="list" className="divide-y divide-gray-200">{order.items.map((item) => (<li key={item.id} className="flex p-6 gap-4"><img src={item.image} alt={item.name} className="w-20 h-20 rounded-md object-cover border" /><div className="flex-1"><h3 className="text-sm font-medium">{item.name}</h3><p className="mt-1 text-xs text-gray-500">{item.color} / {item.size}</p><div className="flex items-end justify-between mt-2"><p className="text-sm text-gray-500">SL: <span className="font-medium">{item.quantity}</span></p><p className="text-sm font-medium">{formatPrice(item.price * item.quantity)}</p></div></div></li>))}</ul>
            <div className="border-t p-6 space-y-3 text-sm">
              <div className="flex justify-between"><span>Tạm tính</span><span className="font-medium">{formatPrice(subtotal)}</span></div>
              <div className="flex justify-between"><span>Phí giao hàng</span><span className="font-medium">{formatPrice(order.shipping_fee)}</span></div>
              {order.discount > 0 && (<div className="flex justify-between text-green-600"><span>Giảm giá</span><span>-{formatPrice(order.discount)}</span></div>)}
              <div className="flex justify-between pt-3 border-t text-base font-semibold"><span>Tổng cộng</span><span>{formatPrice(order.total_price)}</span></div>
            </div>
          </section>

          <section className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-lg font-semibold border-b pb-3 mb-4">Thông tin giao hàng</h2>
            <div className="text-sm space-y-1">
              <p className="font-medium">{order.customer.name}</p>
              <p className="text-gray-600">{order.customer.phone}</p>
              <p className="text-gray-600">{order.customer.email}</p>
              <p className="text-gray-600">{order.customer.address}</p>
            </div>
          </section>
        </div>

        <div className="mt-10 pt-8 border-t flex flex-col sm:flex-row items-center justify-center gap-4">
            <button 
              onClick={handleClearCartAndContinue} 
              type="button" 
              className="w-full sm:w-auto text-center px-6 py-2.5 border rounded-md text-sm font-medium text-red-700 bg-red-50 hover:bg-red-100 transition"
            >
                Xóa giỏ hàng & Quay về trang chủ
            </button>
            <Link 
              to="/" 
              className="w-full sm:w-auto text-center px-6 py-2.5 border border-transparent rounded-md text-sm font-medium text-white bg-gray-800 hover:bg-gray-700 transition"
            >
                Tiếp tục mua sắm
            </Link>
        </div>
      </div>
    </div>
  );
}

export default OrderConfirmationNotAuthenPage;