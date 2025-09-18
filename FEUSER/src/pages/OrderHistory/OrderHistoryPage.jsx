import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext'; 
import { FiPackage, FiCalendar, FiHash, FiLoader, FiAlertTriangle } from 'react-icons/fi';

const formatCurrency = (amount) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);

const OrderStatusBadge = ({ status }) => {
    const statusInfo = {
        '0': { text: 'Đang chờ xử lý', className: 'bg-yellow-100 text-yellow-800' },
        '1': { text: 'Đã xác nhận', className: 'bg-blue-100 text-blue-800' },
        '2': { text: 'Đã giao/Hoàn thành', className: 'bg-green-100 text-green-800' },
    };
    const currentStatus = statusInfo[status] || { text: 'Không rõ', className: 'bg-gray-100' };
    return <span className={`px-3 py-1 text-xs font-semibold rounded-full ${currentStatus.className}`}>{currentStatus.text}</span>;
};

const OrderHistoryPage = () => {
    const { token } = useAuth();
    const [orders, setOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!token) {
            setError("Vui lòng đăng nhập để xem lịch sử.");
            setIsLoading(false);
            return;
        }

        const fetchOrderHistory = async () => {
            setIsLoading(true);
            try {
                const response = await axios.get('https://benodejs-9.onrender.com/api/orders/customer', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                setOrders(response.data.success ? response.data.data : []);
            } catch (err) {
                setError(err.response?.data?.message || 'Đã có lỗi xảy ra.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchOrderHistory();
    }, [token]);

    if (isLoading) return <div className="bg-white rounded-lg shadow p-6 text-center"><FiLoader className="animate-spin inline-block mr-2" /> Đang tải...</div>;
    if (error) return <div className="bg-white rounded-lg shadow p-6 text-center text-red-500"><FiAlertTriangle className="inline-block mr-2" /> {error}</div>;

    return (
        <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Lịch sử đơn hàng</h2>
            {orders.length === 0 ? (
                <div className="text-center py-10">
                    <FiPackage className="mx-auto text-5xl text-gray-400 mb-4" />
                    <p className="text-gray-600">Bạn chưa có đơn hàng nào.</p>
                </div>
            ) : (
                <div className="space-y-6">
                    {orders.map((order) => (
                        <div key={order.id} className="border border-gray-200 rounded-lg">
                            <div className="bg-gray-50 p-4 flex flex-wrap justify-between items-center gap-4">
                                <div>
                                    <p className="font-bold text-gray-800 flex items-center"><FiHash className="mr-2" /> Đơn #{order.id}</p>
                                    <p className="text-sm text-gray-500 flex items-center mt-1"><FiCalendar className="mr-2" />{new Date(order.orderdate).toLocaleDateString('vi-VN')}</p>
                                </div>
                                <OrderStatusBadge status={order.orderstatus} />
                                <div className="text-right">
                                    <p className="text-sm text-gray-600">Tổng tiền</p>
                                    <p className="font-bold text-lg text-blue-600">{formatCurrency(order.totalAmount)}</p>
                                </div>
                            </div>
                            <div className="p-4 space-y-4">
                                {order.orderDetails.map((detail) => (
                                    <div key={detail.id} className="flex items-start space-x-4">
                                        <img src={detail.image_url || 'https://via.placeholder.com/150'} alt={detail.product.name} className="w-20 h-20 object-cover rounded-md" />
                                        <div className="flex-grow">
                                            <p className="font-semibold">{detail.product.name}</p>
                                            <p className="text-sm text-gray-500">Màu: {detail.colorVariant.name} - Size: {detail.sizeVariant.name}</p>
                                            <p className="text-sm text-gray-500">Số lượng: {detail.quantity}</p>
                                        </div>
                                        <div className="text-right font-semibold">{formatCurrency(detail.subtotal)}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default OrderHistoryPage;