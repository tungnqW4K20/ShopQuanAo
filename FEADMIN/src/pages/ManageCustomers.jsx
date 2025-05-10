// src/pages/ManageCustomers.jsx
import React, { useState, useEffect, useCallback, useMemo } from 'react'; // Added useMemo
import customerApiService from '../services/customerApiService';
import CustomerTable from '../components/Customers/CustomerTable';
import CustomerModal from '../components/Customers/CustomerModal';
import ConfirmDeleteModal from '../components/Category/ConfirmDeleteModal';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AiOutlineUserAdd } from 'react-icons/ai';
import { FaSearch } from 'react-icons/fa'; // Icon for search
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

function ManageCustomers() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(''); // State for the search term

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentCustomer, setCurrentCustomer] = useState(null);
  const [customerToDelete, setCustomerToDelete] = useState(null);

  const { handleUnauthorized } = useAuth();
  const navigate = useNavigate();

  const fetchCustomers = useCallback(async () => {
    setLoading(true);
    try {
      const data = await customerApiService.getAllCustomers();
      setCustomers(data);
    } catch (err) {
      console.error("Fetch customers error in component:", err);
      toast.error(err.message || 'Không thể tải danh sách khách hàng.');
      if (err.shouldLogout || err.status === 401) {
        handleUnauthorized();
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  }, [handleUnauthorized, navigate]);

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  // Memoized filtered list of customers
  const filteredCustomers = useMemo(() => {
    if (!searchTerm.trim()) {
      return customers; // If no search term, return all customers
    }
    return customers.filter(customer =>
      customer.name && customer.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [customers, searchTerm]);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleOpenAddModal = () => {
    setCurrentCustomer(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (customer) => {
    setCurrentCustomer(customer);
    setIsModalOpen(true);
  };

  const handleOpenDeleteDialog = (customer) => {
    setCustomerToDelete(customer);
    setIsDeleteDialogOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentCustomer(null);
  };

  const handleCloseDeleteDialog = () => {
    setIsDeleteDialogOpen(false);
    setCustomerToDelete(null);
  };

  const handleSaveCustomer = async (customerData) => {
    const actionType = currentCustomer ? 'Cập nhật' : 'Thêm';
    try {
      if (currentCustomer) {
        await customerApiService.updateCustomer(currentCustomer.id, customerData);
      } else {
        await customerApiService.createCustomer(customerData);
      }
      toast.success(`${actionType} khách hàng thành công!`);
      handleCloseModal();
      fetchCustomers(); // Refresh the list
    } catch (err) {
      console.error(`Save customer error (${actionType}):`, err);
      toast.error(err.message || `${actionType} khách hàng thất bại.`);
      if (err.shouldLogout || err.status === 401) {
        handleUnauthorized();
        navigate('/login');
      }
    }
  };

  const handleDeleteConfirm = async () => {
    if (!customerToDelete) return;
    try {
      await customerApiService.deleteCustomer(customerToDelete.id);
      toast.success(`Xóa khách hàng "${customerToDelete.name}" thành công!`);
      handleCloseDeleteDialog();
      fetchCustomers(); // Refresh the list
    } catch (err)
    {
      console.error("Delete customer error:", err);
      toast.error(err.message || 'Xóa khách hàng thất bại.');
      if (err.shouldLogout || err.status === 401) {
        handleUnauthorized();
        navigate('/login');
      }
    }
  };

  return (
    <div className="container mx-auto px-4 sm:px-8">
      <ToastContainer autoClose={3000} hideProgressBar />
      <div className="py-8">
        {/* Header: Title, Search, Add Button */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 space-y-3 sm:space-y-0">
          <h1 className="text-2xl font-semibold leading-tight text-gray-800 self-start sm:self-center">
            Quản lý Khách hàng
          </h1>
          <div className="flex items-center space-x-3 w-full sm:w-auto">
            {/* Search Input */}
            <div className="relative flex-grow sm:flex-grow-0">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="text-gray-400" />
              </span>
              <input
                type="text"
                placeholder="Tìm theo tên..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                style={{ minWidth: '200px' }} // Ensure it has some base width
              />
            </div>
            {/* Add Button */}
            <button
              onClick={handleOpenAddModal}
              className="flex items-center bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg transition duration-150 ease-in-out whitespace-nowrap"
            >
              <AiOutlineUserAdd className="mr-2" /> Thêm Khách hàng
            </button>
          </div>
        </div>

        {loading && <p className="text-center text-gray-500 py-4">Đang tải danh sách khách hàng...</p>}

        {!loading && (
          <>
            {/* Specific message for no search results when there are customers */}
            {customers.length > 0 && filteredCustomers.length === 0 && searchTerm.trim() !== '' ? (
              <p className="text-center text-gray-500 py-4">
                Không tìm thấy khách hàng nào khớp với tìm kiếm "{searchTerm}".
              </p>
            ) : (
              <CustomerTable
                customers={filteredCustomers}
                onEdit={handleOpenEditModal}
                onDelete={handleOpenDeleteDialog}
              />
              // CustomerTable will show its own "Không có khách hàng nào để hiển thị."
              // if filteredCustomers is empty (either initially no customers, or search yields nothing from an empty list)
            )}
          </>
        )}
      </div>

      <CustomerModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSaveCustomer}
        customer={currentCustomer}
      />

      <ConfirmDeleteModal
        isOpen={isDeleteDialogOpen}
        onClose={handleCloseDeleteDialog}
        onConfirm={handleDeleteConfirm}
        itemName={customerToDelete?.name}
        itemType="khách hàng"
      />
    </div>
  );
}

export default ManageCustomers;