import React, { useState, useEffect, useCallback, useMemo } from 'react';
import orderApiService from '../services/orderApiService';
import OrderTable from '../components/Order/OrderTable';
import OrderDetailsModal from '../components/Order/OrderDetailModal';
import UpdateOrderStatusModal from '../components/Order/UpdateOrderStatusModal';
import Pagination from '../components/Shared/Pagination';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaSearch } from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext'; 
import { useNavigate } from 'react-router-dom';
import { getOrderStatusInfo } from '../utils/formatting'; 

const ITEMS_PER_PAGE = 10;

function ManageOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [orderStatuses, setOrderStatuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState(''); 

  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isUpdateStatusModalOpen, setIsUpdateStatusModalOpen] = useState(false);
  const [currentOrder, setCurrentOrder] = useState(null);

  const { handleUnauthorized } = useAuth(); 
  const navigate = useNavigate();

  const fetchOrderStatuses = useCallback(async () => {
    try {
      const statuses = await orderApiService.getOrderStatuses();
      setOrderStatuses(statuses || []);
    } catch (err) {
      console.error("Fetch order statuses error:", err);
      toast.error(err.message || 'Không thể tải trạng thái đơn hàng.');
       if (err.shouldLogout || err.status === 401) {
        if (handleUnauthorized) handleUnauthorized(); else logout(); 
        navigate('/login');
      }
    }
  }, [handleUnauthorized, navigate]);


  const fetchOrders = useCallback(async (page = 1, search = '', statusFilter = '') => {
    setLoading(true);
    setError(null);
    try {
      const params = {
        page: page,
        limit: ITEMS_PER_PAGE,
        search: search.trim(), 
        status: statusFilter,  
      };
      const response = await orderApiService.getAllOrders(params);
      setOrders(response.data || []);
      setTotalPages(response.pagination?.totalPages || 0);
      setTotalItems(response.pagination?.totalItems || 0);
      setCurrentPage(response.pagination?.currentPage || 1);
    } catch (err) {
      console.error("Fetch orders error:", err);
      toast.error(err.message || 'Không thể tải danh sách đơn hàng.');
      setError(err.message || 'Lỗi tải dữ liệu.');
       if (err.shouldLogout || err.status === 401) {
        if (handleUnauthorized) handleUnauthorized(); else logout();
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  }, [handleUnauthorized, navigate]);

  useEffect(() => {
    fetchOrderStatuses();
  }, [fetchOrderStatuses]);

  useEffect(() => {
    fetchOrders(currentPage, searchTerm, filterStatus);
  }, [fetchOrders, currentPage, searchTerm, filterStatus]);


  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1); 
  };

  const handleStatusFilterChange = (event) => {
    setFilterStatus(event.target.value);
    setCurrentPage(1); 
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleOpenDetailsModal = (order) => {
    setCurrentOrder(order);
    setIsDetailsModalOpen(true);
  };

  const handleCloseDetailsModal = () => {
    setIsDetailsModalOpen(false);
    setCurrentOrder(null);
  };

  const handleOpenUpdateStatusModal = (order) => {
    setCurrentOrder(order);
    setIsUpdateStatusModalOpen(true);
  };

  const handleCloseUpdateStatusModal = () => {
    setIsUpdateStatusModalOpen(false);
    setCurrentOrder(null);
  };

  const handleUpdateStatusSubmit = async (orderId, statusApiKey) => {
    try {
      await orderApiService.updateOrderStatus(orderId, statusApiKey);
      toast.success(`Cập nhật trạng thái đơn hàng #${orderId} thành công!`);
      handleCloseUpdateStatusModal();
      fetchOrders(currentPage, searchTerm, filterStatus); 
    } catch (err) {
      console.error("Update order status error:", err);
      toast.error(err.message || `Cập nhật trạng thái đơn hàng #${orderId} thất bại.`);
      if (err.shouldLogout || err.status === 401) {
        if (handleUnauthorized) handleUnauthorized(); else logout();
        navigate('/login');
      }
    }
  };
  
  const logout = () => {
    localStorage.removeItem('token'); 
    localStorage.removeItem('user'); 
    navigate('/login');
  }


  return (
    <div className="container mx-auto px-4 sm:px-8">
      <ToastContainer autoClose={3000} hideProgressBar />
      <div className="py-8">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 space-y-3 sm:space-y-0">
          <h1 className="text-2xl font-semibold leading-tight text-gray-800 self-start sm:self-center">
            Quản lý Đơn hàng
          </h1>
          <div className="flex flex-col sm:flex-row items-center space-y-3 sm:space-y-0 sm:space-x-3 w-full sm:w-auto">
            <div className="relative flex-grow sm:flex-grow-0 w-full sm:w-auto">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="text-gray-400" />
              </span>
              <input
                type="text"
                placeholder="Tìm theo ID, tên KH, email..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                style={{ minWidth: '240px' }}
              />
            </div>
            <div className="relative flex-grow sm:flex-grow-0 w-full sm:w-auto">
              <select
                value={filterStatus}
                onChange={handleStatusFilterChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                style={{ minWidth: '200px' }}
              >
                <option value="">Tất cả trạng thái</option>
                {orderStatuses.map(status => (
                  <option key={status.modelValue} value={status.modelValue}>
                    {status.description}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {error && !loading && <p className="text-center text-red-500 py-4">{error}</p>}
        
        <OrderTable
          orders={orders}
          orderStatuses={orderStatuses}
          onOpenDetailsModal={handleOpenDetailsModal}
          onOpenUpdateStatusModal={handleOpenUpdateStatusModal}
          loading={loading && orders.length === 0} 
        />
        
        {!loading && orders.length === 0 && !error && (
            searchTerm.trim() !== '' || filterStatus.trim() !== '' ? (
                <p className="text-center text-gray-500 py-4">
                Không tìm thấy đơn hàng nào khớp với tiêu chí tìm kiếm/lọc.
                </p>
            ) : (
                 !error && <p className="text-center text-gray-500 py-4">Chưa có đơn hàng nào.</p> 
            )
        )}


        {totalPages > 0 && !loading && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        )}
         <p className="text-sm text-gray-600 text-center mt-2">
            {totalItems > 0 && !loading ? `Hiển thị trang ${currentPage} / ${totalPages}. Tổng số ${totalItems} đơn hàng.` : ''}
         </p>
      </div>

      <OrderDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={handleCloseDetailsModal}
        order={currentOrder}
        orderStatuses={orderStatuses}
      />

      <UpdateOrderStatusModal
        isOpen={isUpdateStatusModalOpen}
        onClose={handleCloseUpdateStatusModal}
        onSubmit={handleUpdateStatusSubmit}
        order={currentOrder}
        availableStatuses={orderStatuses}
      />
    </div>
  );
}

export default ManageOrdersPage;