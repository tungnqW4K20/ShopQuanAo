// src/pages/DashboardPage.js
import React, { useState, useEffect, useCallback } from 'react';
import {
  ChartBarIcon,
  ShoppingCartIcon,
  CurrencyDollarIcon,
  UserGroupIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline';
// Area sẽ được dùng để tạo gradient
import { AreaChart, Area, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import dashboardApiService from '../services/dashboardApiService';
import { toast } from 'react-toastify';

// --- CÁC COMPONENT CON (KHÔNG THAY ĐỔI) ---

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
       <p className={`mt-2 text-xs font-medium text-gray-400`}>
        {change}
      </p>
    </div>
  );
};

const OrderStatus = ({ status }) => {
  const statusKey = {
    '0': 'pending',
    '1': 'shipping',
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

// *** COMPONENT MỚI: TOOLTIP TÙY CHỈNH CHO BIỂU ĐỒ ***
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-200">
        <p className="label text-sm font-semibold text-gray-800">{`Ngày: ${label}`}</p>
        <p className="intro text-sm text-blue-600">
          {`Doanh thu: ${new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(payload[0].value)}`}
        </p>
      </div>
    );
  }
  return null;
};


// --- COMPONENT CHÍNH ---

function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dashboardData, setDashboardData] = useState({
    stats: [
        { title: 'Tổng doanh thu' },
        { title: 'Tổng đơn hàng' },
        { title: 'Tổng số khách hàng' },
        { title: 'Tỷ lệ chuyển đổi' },
    ],
    salesChartData: [],
    bestSellers: [],
    recentOrders: [],
  });

  // --- LOGIC GỌI API VÀ XỬ LÝ DỮ LIỆU GIỮ NGUYÊN ---
  const processData = useCallback((orders, customers) => {
    const validOrders = orders.filter(o => o.orderstatus !== '3');
    const totalRevenue = validOrders.reduce((sum, order) => sum + order.orderDetails.reduce((orderSum, item) => orderSum + (parseFloat(item.price) * item.quantity), 0), 0);
    const totalOrders = validOrders.length;
    const totalCustomers = customers.length;
    const mockVisitors = totalCustomers * 3 + totalOrders * 10;
    const conversionRate = mockVisitors > 0 ? (totalOrders / mockVisitors) * 100 : 0;
    
    const salesByDay = {};
    validOrders.forEach(order => {
      const date = new Date(order.orderdate).toLocaleDateString('vi-VN');
      if (!salesByDay[date]) salesByDay[date] = 0;
      salesByDay[date] += order.orderDetails.reduce((orderSum, item) => orderSum + (parseFloat(item.price) * item.quantity), 0);
    });

    const salesChartData = Object.keys(salesByDay)
      .map(date => ({ name: date, DoanhThu: salesByDay[date] }))
      .sort((a, b) => new Date(a.name.split('/').reverse().join('-')) - new Date(b.name.split('/').reverse().join('-')));

    const productSales = {};
    validOrders.forEach(order => {
      order.orderDetails.forEach(item => {
        const { products_id, quantity, product } = item;
        if (!productSales[products_id]) {
          productSales[products_id] = { id: products_id, name: product.name, sales: 0, image: item.image_url || product.image_url };
        }
        productSales[products_id].sales += quantity;
      });
    });

    const bestSellers = Object.values(productSales).sort((a, b) => b.sales - a.sales).slice(0, 4);
    const recentOrders = orders.sort((a, b) => new Date(b.orderdate) - new Date(a.orderdate)).slice(0, 5).map(order => ({
      id: `#CM${order.id}`,
      customer: order.customer.name,
      total: order.orderDetails.reduce((sum, item) => sum + (parseFloat(item.price) * item.quantity), 0),
      status: order.orderstatus,
    }));

    return {
      stats: [
        { icon: CurrencyDollarIcon, title: 'Tổng doanh thu', value: `${new Intl.NumberFormat('vi-VN').format(totalRevenue)}đ`, change: 'Từ tất cả đơn hàng', color: 'blue' },
        { icon: ShoppingCartIcon, title: 'Tổng đơn hàng', value: totalOrders, change: 'Không tính đơn hủy', color: 'green' },
        { icon: UserGroupIcon, title: 'Tổng số khách hàng', value: totalCustomers, change: 'Từ trước đến nay', color: 'purple' },
        { icon: ChartBarIcon, title: 'Tỷ lệ chuyển đổi', value: `${conversionRate.toFixed(2)}%`, change: '(Mô phỏng)', color: 'yellow' },
      ],
      salesChartData,
      bestSellers,
      recentOrders,
    };
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const [ordersData, customersData] = await Promise.all([
          dashboardApiService.getAllOrders(),
          dashboardApiService.getAllCustomers(),
        ]);
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

  // --- PHẦN GIAO DIỆN CHÍNH (CÓ CÁC THAY ĐỔI TRONG BIỂU ĐỒ) ---
  return (
    <div className="bg-gray-50/50 p-4 sm:p-6 lg:p-8 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Tổng quan</h1>
          <p className="text-gray-600 mt-1">Chào mừng trở lại! Dưới đây là tình hình kinh doanh tổng thể của bạn.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {dashboardData.stats.map((stat, index) => (
            <StatsCard key={index} {...stat} loading={loading}/>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Biểu đồ doanh thu theo ngày</h2>
            <div className="h-80">
                {loading ? <div className="h-full bg-gray-200 rounded-lg animate-pulse"></div> : (
                    <ResponsiveContainer width="100%" height="100%">
                        {/* *** THAY ĐỔI TỪ LineChart -> AreaChart ĐỂ CÓ NỀN *** */}
                        <AreaChart data={dashboardData.salesChartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                            {/* Định nghĩa Gradient để tô màu cho vùng Area */}
                            <defs>
                                <linearGradient id="colorDoanhThu" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#2563EB" stopOpacity={0.8}/>
                                    <stop offset="95%" stopColor="#2563EB" stopOpacity={0}/>
                                </linearGradient>
                            </defs>

                            {/* Lưới ngang, bỏ lưới dọc để thoáng hơn */}
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />

                            {/* Trục X, bỏ đường kẻ trục và đường tick */}
                            <XAxis 
                                dataKey="name" 
                                tick={{ fontSize: 12, fill: '#6B7280' }} 
                                axisLine={false}
                                tickLine={false}
                            />
                            
                            {/* Trục Y, bỏ đường kẻ trục và đường tick */}
                            <YAxis 
                                tickFormatter={(value) => `${(value / 1_000_000).toFixed(1)}tr`} 
                                tick={{ fontSize: 12, fill: '#6B7280' }}
                                axisLine={false}
                                tickLine={false}
                                width={40}
                            />
                            
                            {/* Sử dụng Tooltip tùy chỉnh đã tạo */}
                            <Tooltip content={<CustomTooltip />} />
                            
                            {/* Component Area để vẽ vùng gradient */}
                            <Area type="monotone" dataKey="DoanhThu" stroke="#2563EB" fillOpacity={1} fill="url(#colorDoanhThu)" />
                            
                            {/* Component Line vẫn được vẽ đè lên trên để có đường kẻ đậm */}
                            <Line 
                                type="monotone" 
                                dataKey="DoanhThu" 
                                stroke="#2563EB" 
                                strokeWidth={3}
                                dot={false} // Ẩn các chấm tròn mặc định
                                activeDot={{ r: 7, stroke: '#2563EB', strokeWidth: 2, fill: '#fff' }} // Tùy chỉnh chấm tròn khi hover
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                )}
            </div>
          </div>
          
          {/* Các phần còn lại của Dashboard không thay đổi */}
          <div className="lg:col-span-1 bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Sản phẩm bán chạy nhất</h2>
            <ul className="space-y-4">
              {loading ? Array(4).fill(0).map((_, i) => (
                <li key={i} className="flex items-center space-x-4 animate-pulse"><div className="w-16 h-16 bg-gray-200 rounded-md"></div><div className="flex-1 space-y-2"><div className="h-4 bg-gray-200 rounded w-full"></div><div className="h-3 bg-gray-200 rounded w-1/2"></div></div></li>
              )) : dashboardData.bestSellers.map((product) => (
                <li key={product.id} className="flex items-center space-x-4"><img src={product.image} alt={product.name} className="w-16 h-16 object-cover rounded-md bg-gray-100" /><div className="flex-1"><p className="font-semibold text-sm text-gray-800">{product.name}</p></div><p className="font-bold text-sm text-blue-600">{product.sales} sp</p></li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-3 bg-white p-6 rounded-lg shadow-sm">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Đơn hàng gần đây</h2>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="text-left text-gray-500"><tr><th className="p-2 font-medium">Mã ĐH</th><th className="p-2 font-medium">Khách hàng</th><th className="p-2 font-medium">Tổng tiền</th><th className="p-2 font-medium text-center">Trạng thái</th></tr></thead>
                        <tbody>
                            {loading ? Array(5).fill(0).map((_,i) => (
                                <tr key={i} className="border-t border-gray-100 animate-pulse"><td className="p-3"><div className="h-4 bg-gray-200 rounded w-1/2"></div></td><td className="p-3"><div className="h-4 bg-gray-200 rounded w-3/4"></div></td><td className="p-3"><div className="h-4 bg-gray-200 rounded w-1/2"></div></td><td className="p-3 text-center"><div className="h-6 w-20 mx-auto bg-gray-200 rounded-full"></div></td></tr>
                            )) : dashboardData.recentOrders.map(order => (
                                <tr key={order.id} className="border-t border-gray-100"><td className="p-3 font-semibold text-blue-600">{order.id}</td><td className="p-3 text-gray-700">{order.customer}</td><td className="p-3 font-medium text-gray-800">{new Intl.NumberFormat('vi-VN').format(order.total)}đ</td><td className="p-3 text-center"><OrderStatus status={order.status} /></td></tr>
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