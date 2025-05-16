// src/pages/ManageOrdersPage.jsx
import React, { useState, useEffect, useCallback } from 'react';
import orderApiService from '../services/orderApiService';
import OrderTable from '../components/Order/OrderTable';
import OrderDetailModal from '../components/Order/OrderDetailModal';
import UpdateOrderStatusModal from '../components/Order/UpdateOrderStatusModal';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaSearch } from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

function ManageOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loadingList, setLoadingList] = useState(true); // Loading cho danh sách
  const [searchTerm, setSearchTerm] = useState('');
  const [pagination, setPagination] = useState({
    currentPage: 1,
    itemsPerPage: 10,
    totalItems: 0,
    totalPages: 1,
  });

  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  
  const [selectedOrderForModal, setSelectedOrderForModal] = useState(null); // Đơn hàng được chọn cho modal chi tiết
  const [loadingOrderDetails, setLoadingOrderDetails] = useState(false); // Loading cho chi tiết trong modal
  const [orderDetailsError, setOrderDetailsError] = useState(''); // Lỗi khi fetch chi tiết

  const [orderForStatusUpdate, setOrderForStatusUpdate] = useState(null); // Đơn hàng cho modal cập nhật trạng thái


  const { handleUnauthorized } = useAuth();
  const navigate = useNavigate();

  const fetchOrders = useCallback(async (page = 1, limit = 10) => {
    setLoadingList(true);
    try {
      const params = {
        offset: (page - 1) * limit,
        limit: limit,
      };
      if (searchTerm.trim()) {
        if (!isNaN(parseInt(searchTerm.trim()))) {
            params.customerId = parseInt(searchTerm.trim());
        }
      }

      const response = await orderApiService.getAllOrders(params);
      setOrders(response.rows); // response.rows đã có total_amount từ service
      setPagination(prev => ({
        ...prev,
        currentPage: page,
        totalItems: response.count,
        totalPages: Math.ceil(response.count / limit),
      }));

    } catch (err) {
      console.error("Fetch orders error:", err);
      toast.error(err.message || 'Không thể tải danh sách đơn hàng.');
      if (err.shouldLogout || err.status === 401) {
        handleUnauthorized(); navigate('/login');
      }
    } finally {
      setLoadingList(false);
    }
  }, [searchTerm, handleUnauthorized, navigate]);

  useEffect(() => {
    fetchOrders(pagination.currentPage, pagination.itemsPerPage);
  }, [fetchOrders, pagination.currentPage, pagination.itemsPerPage]);

  const handleSearchChange = (event) => setSearchTerm(event.target.value);
  
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchOrders(1, pagination.itemsPerPage);
  };

  // Mở modal chi tiết và fetch dữ liệu chi tiết cho đơn hàng đó
  const handleOpenDetailModal = async (orderFromTable) => {
    setIsDetailModalOpen(true);
    setSelectedOrderForModal(null); // Reset trước khi fetch
    setLoadingOrderDetails(true);
    setOrderDetailsError('');
    try {
      const detailedOrder = await orderApiService.getOrderById(orderFromTable.id);
      setSelectedOrderForModal(detailedOrder); // Dữ liệu này đã có total_amount từ service
    } catch (err) {
      console.error("Error fetching order details for modal:", err);
      setOrderDetailsError(err.message || "Không thể tải chi tiết đơn hàng.");
      toast.error(err.message || "Không thể tải chi tiết đơn hàng.");
      if (err.shouldLogout || err.status === 401) {
        handleUnauthorized(); navigate('/login');
      }
    } finally {
      setLoadingOrderDetails(false);
    }
  };
  

  const handleOpenStatusModal = (order) => {
    setOrderForStatusUpdate(order); // Dùng order từ table là đủ thông tin cho modal status
    setIsStatusModalOpen(true);
  };

  const handleCloseModals = () => {
    setIsDetailModalOpen(false);
    setIsStatusModalOpen(false);
    setSelectedOrderForModal(null);
    setOrderForStatusUpdate(null);
    setLoadingOrderDetails(false); // Reset trạng thái loading/error của modal chi tiết
    setOrderDetailsError('');
  };

  const handleUpdateStatusSubmit = async (newStatus) => {
    if (!orderForStatusUpdate || orderForStatusUpdate.orderstatus === newStatus) {
      handleCloseModals();
      return;
    }
    try {
      await orderApiService.updateOrderStatus(orderForStatusUpdate.id, { status: newStatus });
      toast.success(`Cập nhật trạng thái cho đơn hàng #${orderForStatusUpdate.id} thành công!`);
      handleCloseModals();
      fetchOrders(pagination.currentPage, pagination.itemsPerPage);
    } catch (err) {
      console.error("Update order status error:", err);
      toast.error(err.message || 'Cập nhật trạng thái thất bại.');
       if (err.shouldLogout || err.status === 401) {
        handleUnauthorized(); navigate('/login');
      }
    }
  };
  
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      fetchOrders(newPage, pagination.itemsPerPage);
    }
  };

  return (
    <div className="container mx-auto px-4 sm:px-8">
      <ToastContainer autoClose={3000} hideProgressBar />
      <div className="py-8">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 space-y-3 sm:space-y-0">
          <h1 className="text-2xl font-semibold leading-tight text-gray-800 self-start sm:self-center">
            Quản lý Đơn hàng
          </h1>
          <form onSubmit={handleSearchSubmit} className="flex items-center space-x-3 w-full sm:w-auto">
            <div className="relative flex-grow sm:flex-grow-0">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="text-gray-400" />
              </span>
              <input
                type="text"
                placeholder="Tìm theo ID khách hàng..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 sm:text-sm"
                style={{ minWidth: '250px' }}
              />
            </div>
             <button
                type="submit"
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg transition duration-150 ease-in-out whitespace-nowrap"
            >
                Tìm kiếm
            </button>
          </form>
        </div>

        {loadingList && <p className="text-center text-gray-500 py-4">Đang tải danh sách đơn hàng...</p>}
        {!loadingList && (
          <OrderTable
            orders={orders}
            onViewDetails={handleOpenDetailModal} // Truyền hàm mới
            onUpdateStatus={handleOpenStatusModal}
          />
        )}
        
        {!loadingList && orders.length > 0 && pagination.totalPages > 1 && (
          <div className="flex justify-center items-center mt-6 space-x-2">
            {/* Pagination JSX giữ nguyên */}
            <button
              onClick={() => handlePageChange(pagination.currentPage - 1)}
              disabled={pagination.currentPage === 1}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 disabled:opacity-50"
            >
              Trước
            </button>
            {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(pageNumber => (
              <button
                key={pageNumber}
                onClick={() => handlePageChange(pageNumber)}
                className={`px-4 py-2 rounded-md ${
                  pagination.currentPage === pageNumber
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {pageNumber}
              </button>
            ))}
            <button
              onClick={() => handlePageChange(pagination.currentPage + 1)}
              disabled={pagination.currentPage === pagination.totalPages}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 disabled:opacity-50"
            >
              Sau
            </button>
            <span className="text-sm text-gray-600">
              Trang {pagination.currentPage} / {pagination.totalPages} (Tổng: {pagination.totalItems} đơn hàng)
            </span>
          </div>
        )}
      </div>

      {isDetailModalOpen && (
        <OrderDetailModal
          isOpen={isDetailModalOpen}
          onClose={handleCloseModals}
          order={selectedOrderForModal} // Dữ liệu chi tiết đã fetch
          loadingOrderDetails={loadingOrderDetails} // Trạng thái loading của việc fetch chi tiết
          orderDetailsError={orderDetailsError} // Lỗi nếu có khi fetch chi tiết
        />
      )}


      {isStatusModalOpen && (
          <UpdateOrderStatusModal
            isOpen={isStatusModalOpen}
            onClose={handleCloseModals}
            onSubmit={handleUpdateStatusSubmit}
            order={orderForStatusUpdate} // Truyền đơn hàng cần cập nhật trạng thái
        />
      )}
    </div>
  );
}

export default ManageOrdersPage;