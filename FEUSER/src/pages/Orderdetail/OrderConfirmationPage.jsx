import React, { useState, useEffect } from 'react';
import { CheckCircleIcon } from '@heroicons/react/24/solid';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { useParams } from 'react-router-dom';

// --- Helper Functions ---
const formatPrice = (value) => {
  if (value === null || value === undefined) return '0đ';
  return Number(value).toLocaleString('vi-VN') + 'đ';
};

const formatDate = (dateString) => {
  const options = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  };
  return new Date(dateString).toLocaleDateString('vi-VN', options);
};

const getPaymentMethodName = (id) => {
  const methods = {
    cod: 'Thanh toán khi nhận hàng (COD)',
    momo: 'Ví MoMo',
    zalopay: 'ZaloPay',
    vnpay: 'VNPAY',
  };
  return methods[id] || 'Không xác định';
};

const renderStatusBadge = (status) => {
  const statusMap = {
    '0': 'pending',
    '1': 'processing',
    '2': 'shipped',
    '3': 'delivered',
    '4': 'cancelled',
  };
  const statusKey = statusMap[status] || 'pending';
  const statusStyles = {
    pending: 'bg-yellow-100 text-yellow-800',
    processing: 'bg-blue-100 text-blue-800',
    shipped: 'bg-indigo-100 text-indigo-800',
    delivered: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
  };
  const statusText = {
    pending: 'Đang xử lý',
    processing: 'Đang chuẩn bị hàng',
    shipped: 'Đang giao hàng',
    delivered: 'Đã giao hàng',
    cancelled: 'Đã hủy',
  };
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
        statusStyles[statusKey] || 'bg-gray-100 text-gray-800'
      }`}
    >
      {statusText[statusKey] || 'Không xác định'}
    </span>
  );
};

// --- Component ---
function OrderConfirmationPage() {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { token } = useAuth();
  const { orderId } = useParams(); // Lấy orderId từ URL

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await axios.get(
          `https://benodejs-9.onrender.com/api/orders/${orderId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (response.data.success && response.data.data) {
          const orderData = response.data.data;

          // Tính tổng tiền
          const calculatedTotal = orderData.orderDetails.reduce((sum, item) => {
            return sum + parseFloat(item.price) * item.quantity;
          }, 0);

          const formattedOrder = {
            id: orderData.id,
            createdAt: orderData.orderdate,
            status: orderData.orderstatus,
            total_price: calculatedTotal,
            shipping_fee: 25000, // fix cứng vì API chưa trả về
            discount: 0, // fix cứng
            payment_method: 'cod', // fix cứng
            customer: {
              name: orderData.customer?.name || 'Khách hàng',
              email: orderData.customer?.email || '',
              phone: 'Chưa có SĐT', // API chưa có
            },
            items: orderData.orderDetails.map((item) => ({
              id: item.id,
              productId: item.products_id,
              name: item.product?.name || 'Sản phẩm',
              image: item.image_url,
              color: item.colorVariant?.name || '',
              size: item.sizeVariant?.name || '',
              quantity: item.quantity,
              price: parseFloat(item.price),
            })),
          };

          setOrder(formattedOrder);
        } else {
          setError('Không tìm thấy đơn hàng.');
        }
      } catch (err) {
        setError('Đã xảy ra lỗi khi tải thông tin đơn hàng.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId, token]);

  if (loading) {
    return <div className="text-center py-20">Đang tải thông tin đơn hàng...</div>;
  }

  if (error) {
    return <div className="text-center py-20 text-red-600">{error}</div>;
  }

  if (!order) {
    return <div className="text-center py-20">Không có thông tin đơn hàng để hiển thị.</div>;
  }

  const subtotal = order.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <div className="bg-gray-50 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center">
          <CheckCircleIcon
            className="h-12 w-12 text-green-500 mx-auto"
            aria-hidden="true"
          />
          <h1 className="mt-4 text-2xl sm:text-3xl font-bold tracking-tight text-gray-900">
            Đặt Hàng Thành Công!
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Cảm ơn bạn đã mua sắm. Đơn hàng của bạn đang được xử lý.
          </p>
        </div>

        <div className="mt-10 space-y-8">
          {/* Order Summary */}
          <section className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 border-b pb-3 mb-4">
              Tổng quan đơn hàng
            </h2>
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-gray-600">Mã đơn hàng:</dt>
                <dd className="font-semibold text-gray-900">{order.id}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-600">Ngày đặt:</dt>
                <dd className="text-gray-700">{formatDate(order.createdAt)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-600">Tổng tiền:</dt>
                <dd className="font-semibold text-indigo-600">
                  {formatPrice(
                    order.total_price + order.shipping_fee - order.discount
                  )}
                </dd>
              </div>
              <div className="flex justify-between items-center">
                <dt className="text-gray-600">Trạng thái:</dt>
                <dd>{renderStatusBadge(order.status)}</dd>
              </div>
            </dl>
          </section>

          {/* Order Items */}
          <section className="bg-white rounded-lg shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 p-6 border-b">
              Chi tiết sản phẩm
            </h2>
            <ul role="list" className="divide-y divide-gray-200">
              {order.items.map((item) => (
                <li key={item.id} className="flex p-4 sm:p-6 gap-4">
                  <div className="flex-shrink-0">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-20 h-20 rounded-md object-cover border"
                    />
                  </div>
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="text-sm font-medium text-gray-800">
                        {item.name}
                      </h3>
                      <p className="mt-1 text-xs text-gray-500">
                        {item.color} / {item.size}
                      </p>
                    </div>
                    <div className="flex items-end justify-between mt-2">
                      <p className="text-sm text-gray-500">
                        SL:{' '}
                        <span className="font-medium text-gray-800">
                          {item.quantity}
                        </span>
                      </p>
                      <p className="text-sm font-medium text-gray-900">
                        {formatPrice(item.price * item.quantity)}
                      </p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
            <div className="border-t p-6 space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Tạm tính</span>
                <span className="font-medium text-gray-900">
                  {formatPrice(subtotal)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Phí giao hàng</span>
                <span className="font-medium text-gray-900">
                  {formatPrice(order.shipping_fee)}
                </span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Giảm giá</span>
                  <span>-{formatPrice(order.discount)}</span>
                </div>
              )}
              <div className="flex justify-between pt-3 border-t text-base font-semibold">
                <span>Tổng cộng</span>
                <span>
                  {formatPrice(
                    subtotal + order.shipping_fee - order.discount
                  )}
                </span>
              </div>
            </div>
          </section>

          {/* Buyer Information */}
          <section className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 border-b pb-3 mb-4">
              Thông tin giao hàng
            </h2>
            <div className="text-sm space-y-1">
              <p className="font-medium text-gray-900">{order.customer.name}</p>
              <p className="text-gray-600">{order.customer.phone}</p>
              <p className="text-gray-600">{order.customer.email}</p>
            </div>
          </section>

          {/* Payment Information */}
          <section className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 border-b pb-3 mb-4">
              Phương thức thanh toán
            </h2>
            <p className="text-sm text-gray-600">
              {getPaymentMethodName(order.payment_method)}
            </p>
          </section>
        </div>

        {/* Action Buttons */}
        <div className="mt-10 pt-8 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href="/profile/orders"
            className="w-full sm:w-auto text-center px-6 py-2.5 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition"
          >
            Xem lịch sử đơn hàng
          </a>
          <a
            href="/"
            className="w-full sm:w-auto text-center px-6 py-2.5 border border-transparent rounded-md text-sm font-medium text-white bg-gray-800 hover:bg-gray-700 transition"
          >
            Tiếp tục mua sắm
          </a>
        </div>
      </div>
    </div>
  );
}

export default OrderConfirmationPage;
