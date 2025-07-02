import React, { useState, useEffect, useCallback } from 'react';
import {
  ChartBarIcon,
  ShoppingCartIcon,
  CurrencyDollarIcon,
  UserGroupIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import dashboardApiService from '../services/dashboardApiService';
import { toast } from 'react-toastify';

const StatsCard = ({ icon: Icon, title, value, change, changeType, color, loading }) => {
  const colorClasses = {
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    purple: 'bg-purple-100 text-purple-600',
    yellow: 'bg-yellow-100 text-yellow-600',
  };
  if (loading) {
    return (
        <div className="bg-white p-6 rounded-lg shadow-sm animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-8 bg-gray-300 rounded w-1/2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/3 mt-3"></div>
        </div>
    );
  }
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-lg transition-shadow duration-300">
      <div className="flex items-start justify-between">
        <div className="flex flex-col space-y-1">
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="text-2xl font-bold text-gray-800">{value}</p>
        </div>
        <div className={`p-3 rounded-full ${colorClasses[color]}`}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
      <p className={`mt-2 text-xs font-medium ${changeType === 'increase' ? 'text-green-600' : 'text-red-600'}`}>
        {change}
      </p>
    </div>
  );
};

const OrderStatus = ({ status }) => {
  // Chuyển đổi trạng thái từ API ("0", "1", "2") sang key của object
  const statusKey = {
    '0': 'pending',
    '1': 'shipping', // Giả sử '1' là đang giao
    '2': 'completed',
    '3': 'cancelled',
  }[status];

  const statusInfo = {
    pending: { text: 'Chờ xử lý', class: 'bg-yellow-100 text-yellow-800' },
    shipping: { text: 'Đang giao', class: 'bg-blue-100 text-blue-800' },
    completed: { text: 'Hoàn thành', class: 'bg-green-100 text-green-800' },
    cancelled: { text: 'Đã hủy', class: 'bg-red-100 text-red-800' },
  };
  const currentStatus = statusInfo[statusKey] || { text: 'Không xác định', class: 'bg-gray-100 text-gray-800' };
  return <span className={`px-2 py-1 text-xs font-medium rounded-full ${currentStatus.class}`}>{currentStatus.text}</span>;
};


// --- COMPONENT CHÍNH ---

function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dashboardData, setDashboardData] = useState({
    stats: [
        { title: 'Doanh thu hôm nay' },
        { title: 'Đơn hàng mới' },
        { title: 'Khách hàng mới (7 ngày)' },
        { title: 'Tỷ lệ chuyển đổi' },
    ],
    salesChartData: [],
    bestSellers: [],
    recentOrders: [],
  });

  const processData = useCallback((orders, customers) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(today.getDate() - 7);
    sevenDaysAgo.setHours(0, 0, 0, 0);

    // --- 1. TÍNH TOÁN CÁC CHỈ SỐ (KPIs) ---
    const ordersToday = orders.filter(o => {
        const orderDate = new Date(o.orderdate);
        orderDate.setHours(0,0,0,0);
        return orderDate.getTime() === today.getTime();
    });

    const revenueToday = ordersToday.reduce((sum, order) => {
        const orderTotal = order.orderDetails.reduce((orderSum, item) => orderSum + (parseFloat(item.price) * item.quantity), 0);
        return sum + orderTotal;
    }, 0);

    const newCustomersLast7Days = customers.filter(c => new Date(c.createdAt) >= sevenDaysAgo).length;

    // Ở đây, chúng ta tạm mô phỏng nó.
    const mockVisitorsToday = ordersToday.length * 40 + 50; // Giả sử tỷ lệ chuyển đổi ~2.5%
    const conversionRate = mockVisitorsToday > 0 ? (ordersToday.length / mockVisitorsToday) * 100 : 0;
    
    // --- 2. XỬ LÝ DỮ LIỆU BIỂU ĐỒ DOANH THU 7 NGÀY ---
    const salesByDay = Array(7).fill(0).map((_, i) => {
        const date = new Date();
        date.setDate(today.getDate() - (6 - i));
        date.setHours(0,0,0,0);
        return { 
            name: `${date.getDate()}/${date.getMonth() + 1}`,
            fullDate: date,
            DoanhThu: 0 
        };
    });
    
    orders.forEach(order => {
        const orderDate = new Date(order.orderdate);
        orderDate.setHours(0,0,0,0);
        const dayData = salesByDay.find(d => d.fullDate.getTime() === orderDate.getTime());
        if (dayData) {
            const orderTotal = order.orderDetails.reduce((orderSum, item) => orderSum + (parseFloat(item.price) * item.quantity), 0);
            dayData.DoanhThu += orderTotal;
        }
    });


    // --- 3. TÍNH TOÁN SẢN PHẨM BÁN CHẠY ---
    const productSales = {};
    orders.forEach(order => {
        order.orderDetails.forEach(item => {
            const { products_id, quantity, product } = item;
            if (!productSales[products_id]) {
                productSales[products_id] = {
                    id: products_id,
                    name: product.name,
                    category: 'Đang cập nhật', // Cần gọi API sản phẩm để lấy category
                    sales: 0,
                    image: item.image_url || product.image_url, // Lấy ảnh từ chi tiết đơn hàng hoặc sản phẩm
                };
            }
            productSales[products_id].sales += quantity;
        });
    });

    const bestSellers = Object.values(productSales)
        .sort((a, b) => b.sales - a.sales)
        .slice(0, 4);

    // --- 4. LẤY CÁC ĐƠN HÀNG GẦN ĐÂY ---
    const recentOrders = orders
      .sort((a, b) => new Date(b.orderdate) - new Date(a.orderdate))
      .slice(0, 5)
      .map(order => ({
          id: `#CM${order.id}`,
          customer: order.customer.name,
          total: order.orderDetails.reduce((sum, item) => sum + (parseFloat(item.price) * item.quantity), 0),
          status: order.orderstatus,
      }));


    return {
        stats: [
            { icon: CurrencyDollarIcon, title: 'Doanh thu hôm nay', value: `${new Intl.NumberFormat('vi-VN').format(revenueToday)}đ`, change: 'Dữ liệu trực tiếp', changeType: 'increase', color: 'blue' },
            { icon: ShoppingCartIcon, title: 'Đơn hàng mới', value: ordersToday.length, change: 'Trong ngày hôm nay', changeType: 'increase', color: 'green' },
            { icon: UserGroupIcon, title: 'Khách hàng mới (7 ngày)', value: newCustomersLast7Days, change: 'Trong 7 ngày qua', changeType: 'increase', color: 'purple' },
            { icon: ChartBarIcon, title: 'Tỷ lệ chuyển đổi', value: `${conversionRate.toFixed(2)}%`, change: '(Mô phỏng)', changeType: 'increase', color: 'yellow' },
        ],
        salesChartData: salesByDay.map(({name, DoanhThu}) => ({name, DoanhThu})),
        bestSellers,
        recentOrders,
    };
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        // Gọi đồng thời các API
        const [ordersData, customersData] = await Promise.all([
          dashboardApiService.getAllOrders(),
          dashboardApiService.getAllCustomers(),
        ]);
        
        // Xử lý và tính toán dữ liệu
        const processed = processData(ordersData, customersData);
        setDashboardData(processed);
      } catch (err) {
        setError(err.message);
        toast.error(`Lỗi tải dữ liệu Dashboard: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [processData]);

  if (error) {
    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
            <ExclamationTriangleIcon className="h-16 w-16 text-red-500" />
            <h2 className="mt-4 text-2xl font-bold text-gray-800">Không thể tải dữ liệu</h2>
            <p className="mt-2 text-gray-600">{error}</p>
        </div>
    );
  }

  return (
    <div className="bg-gray-50/50 p-4 sm:p-6 lg:p-8 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Tổng quan</h1>
          <p className="text-gray-600 mt-1">Chào mừng trở lại! Dưới đây là tình hình kinh doanh của bạn.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {dashboardData.stats.map((stat, index) => (
            <StatsCard key={index} {...stat} loading={loading}/>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Doanh thu 7 ngày qua</h2>
            <div className="h-80">
                {loading ? <div className="h-full bg-gray-200 rounded-lg animate-pulse"></div> : (
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={dashboardData.salesChartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                        <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                        <YAxis tickFormatter={(value) => `${value / 1_000_000}tr`} tick={{ fontSize: 12 }} />
                        <Tooltip formatter={(value) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value)} />
                        <Legend wrapperStyle={{fontSize: "14px"}}/>
                        <Line type="monotone" dataKey="DoanhThu" stroke="#2563EB" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 8 }} />
                        </LineChart>
                    </ResponsiveContainer>
                )}
            </div>
          </div>

          <div className="lg:col-span-1 bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Sản phẩm bán chạy</h2>
            <ul className="space-y-4">
              {loading ? Array(4).fill(0).map((_, i) => (
                <li key={i} className="flex items-center space-x-4 animate-pulse">
                    <div className="w-16 h-16 bg-gray-200 rounded-md"></div>
                    <div className="flex-1 space-y-2">
                        <div className="h-4 bg-gray-200 rounded w-full"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    </div>
                </li>
              )) : dashboardData.bestSellers.map((product) => (
                <li key={product.id} className="flex items-center space-x-4">
                  <img src={product.image} alt={product.name} className="w-16 h-16 object-cover rounded-md bg-gray-100" />
                  <div className="flex-1">
                    <p className="font-semibold text-sm text-gray-800">{product.name}</p>
                    {/* <p className="text-xs text-gray-500">{product.category}</p> */}
                  </div>
                  <p className="font-bold text-sm text-blue-600">{product.sales} sp</p>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-3 bg-white p-6 rounded-lg shadow-sm">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Đơn hàng gần đây</h2>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="text-left text-gray-500">
                            <tr>
                                <th className="p-2 font-medium">Mã ĐH</th>
                                <th className="p-2 font-medium">Khách hàng</th>
                                <th className="p-2 font-medium">Tổng tiền</th>
                                <th className="p-2 font-medium text-center">Trạng thái</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? Array(5).fill(0).map((_,i) => (
                                <tr key={i} className="border-t border-gray-100 animate-pulse">
                                    <td className="p-3"><div className="h-4 bg-gray-200 rounded w-1/2"></div></td>
                                    <td className="p-3"><div className="h-4 bg-gray-200 rounded w-3/4"></div></td>
                                    <td className="p-3"><div className="h-4 bg-gray-200 rounded w-1/2"></div></td>
                                    <td className="p-3 text-center"><div className="h-6 w-20 mx-auto bg-gray-200 rounded-full"></div></td>
                                </tr>
                            )) : dashboardData.recentOrders.map(order => (
                                <tr key={order.id} className="border-t border-gray-100">
                                    <td className="p-3 font-semibold text-blue-600">{order.id}</td>
                                    <td className="p-3 text-gray-700">{order.customer}</td>
                                    <td className="p-3 font-medium text-gray-800">{new Intl.NumberFormat('vi-VN').format(order.total)}đ</td>
                                    <td className="p-3 text-center"><OrderStatus status={order.status} /></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
           </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;