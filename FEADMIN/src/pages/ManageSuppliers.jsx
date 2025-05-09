// src/pages/ManageSuppliers.js
import  { useState, useEffect, useCallback } from 'react';
import supplierApiService from '../services/supplierApiService';
import SupplierTable from '../components/Supplier/SupplierTable';
import SupplierModal from '../components/Supplier/SupplierModal';
import ConfirmDeleteModal from '../components/Supplier/ConfirmDeleteModal';
import Pagination from '../components/Common/Pagination'; // Import Pagination
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AiOutlinePlus } from 'react-icons/ai';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const ITEMS_PER_PAGE = 10; // Or any number you prefer

function ManageSuppliers() {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentSupplier, setCurrentSupplier] = useState(null);
  const [supplierToDelete, setSupplierToDelete] = useState(null);

  const [currentPage, setCurrentPage] = useState(1); // State for pagination

  const { handleUnauthorized } = useAuth();
  const navigate = useNavigate();

  const fetchSuppliers = useCallback(async () => {
    setLoading(true);
    try {
      const data = await supplierApiService.getAllSuppliers();
      setSuppliers(data);
      setCurrentPage(1); // Reset to first page after fetching
    } catch (err) {
      console.error("Fetch suppliers error in component:", err);
      toast.error(err.message || 'Không thể tải danh sách nhà cung cấp.');
      if (err.shouldLogout || err.status === 401) {
        handleUnauthorized();
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  }, [handleUnauthorized, navigate]);

  useEffect(() => {
    fetchSuppliers();
  }, [fetchSuppliers]);

  // Reset to first page when search term changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const handleOpenAddModal = () => {
    setCurrentSupplier(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (supplier) => {
    setCurrentSupplier(supplier);
    setIsModalOpen(true);
  };

  const handleOpenDeleteDialog = (supplier) => {
    setSupplierToDelete(supplier);
    setIsDeleteDialogOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentSupplier(null);
  };

  const handleCloseDeleteDialog = () => {
    setIsDeleteDialogOpen(false);
    setSupplierToDelete(null);
  };

  const handleSaveSupplier = async (supplierData) => {
    const actionType = currentSupplier ? 'Cập nhật' : 'Thêm';
    setLoading(true);
    try {
      if (currentSupplier) {
        await supplierApiService.updateSupplier(currentSupplier.id, supplierData);
      } else {
        await supplierApiService.createSupplier(supplierData);
      }
      toast.success(`${actionType} nhà cung cấp thành công!`);
      handleCloseModal();
      fetchSuppliers(); // Refresh the list (will also reset page to 1)
    } catch (err) {
      console.error(`Save supplier error (${actionType}):`, err);
      toast.error(err.message || `${actionType} nhà cung cấp thất bại.`);
      if (err.shouldLogout || err.status === 401) {
        handleUnauthorized();
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!supplierToDelete) return;
    setLoading(true);
    try {
      await supplierApiService.deleteSupplier(supplierToDelete.id);
      toast.success(`Xóa nhà cung cấp "${supplierToDelete.name}" thành công!`);
      handleCloseDeleteDialog();
      fetchSuppliers(); // Refresh the list
    } catch (err) {
      console.error("Delete supplier error:", err);
      toast.error(err.message || 'Xóa nhà cung cấp thất bại.');
      if (err.shouldLogout || err.status === 401) {
        handleUnauthorized();
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredSuppliers = suppliers.filter(supplier =>
    supplier.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination logic
  const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
  const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
  const currentItemsOnPage = filteredSuppliers.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= Math.ceil(filteredSuppliers.length / ITEMS_PER_PAGE)) {
      setCurrentPage(pageNumber);
    }
  };

  const showMainLoader = loading && !isModalOpen && !isDeleteDialogOpen;

  return (
    <div className="container mx-auto px-4 sm:px-8">
      <ToastContainer autoClose={3000} hideProgressBar position="top-right" />
      <div className="py-8">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-4">
          <h1 className="text-3xl font-bold leading-tight text-gray-900 mb-4 sm:mb-0">
            Quản lý Nhà Cung Cấp
          </h1>
          <button
            onClick={handleOpenAddModal}
            className="flex items-center bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg shadow-md hover:shadow-lg transition duration-150 ease-in-out"
          >
            <AiOutlinePlus className="mr-2" /> Thêm Nhà Cung Cấp
          </button>
        </div>

        {/* Search Input - Right Aligned and Smaller */}
        <div className="mb-6 flex justify-end">
          <input
            type="text"
            placeholder="Tìm kiếm theo tên..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="shadow-sm appearance-none border rounded w-full sm:w-1/2 md:w-1/3 lg:w-1/4 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            disabled={showMainLoader && suppliers.length === 0}
          />
        </div>

        {showMainLoader ? (
          <div className="flex justify-center items-center h-64">
            <div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12 mb-4"></div>
            <p className="text-center text-gray-600 text-lg">Đang tải dữ liệu...</p>
          </div>
        ) : suppliers.length === 0 ? (
          <p className="text-center text-gray-500 mt-10">Không có nhà cung cấp nào để hiển thị.</p>
        ) : filteredSuppliers.length === 0 ? (
          <p className="text-center text-gray-500 mt-10">
            Không tìm thấy nhà cung cấp nào khớp với tìm kiếm "{searchTerm}".
          </p>
        ) : (
          <>
            <SupplierTable
              suppliers={currentItemsOnPage}
              onEdit={handleOpenEditModal}
              onDelete={handleOpenDeleteDialog}
            />
            {filteredSuppliers.length > ITEMS_PER_PAGE && (
              <div className="mt-6 flex justify-center">
                <Pagination
                  itemsPerPage={ITEMS_PER_PAGE}
                  totalItems={filteredSuppliers.length}
                  paginate={paginate}
                  currentPage={currentPage}
                />
              </div>
            )}
          </>
        )}
      </div>

      <SupplierModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSaveSupplier}
        supplier={currentSupplier}
      />

      <ConfirmDeleteModal
        isOpen={isDeleteDialogOpen}
        onClose={handleCloseDeleteDialog}
        onConfirm={handleDeleteConfirm}
        itemName={supplierToDelete?.name}
        itemType="nhà cung cấp"
      />
    </div>
  );
}

export default ManageSuppliers;