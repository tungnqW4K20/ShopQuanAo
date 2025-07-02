// src/pages/ImportInvoiceManagement.js
import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { PlusIcon } from '@heroicons/react/24/solid';
import importInvoiceApiService from '../services/importInvoiceApiService';
import ImportInvoiceTable from '../components/Import/ImportInvoiceTable';
import ImportInvoiceDetailsModal from '../components/Import/ImportInvoiceDetailsModal';
import CompleteInvoiceConfirmModal from '../components/Import/CompleteInvoiceConfirmModal';
import Pagination from '../components/shared/Pagination';
import FilterBar from '../components/Import/FilterBar'; // *** THÊM IMPORT ***
import { toast } from 'react-toastify';
import { exportInvoiceToExcel } from '../utils/exportUtils'; // *** THÊM IMPORT ***

function ImportInvoiceManagement() {
  const [invoices, setInvoices] = useState([]);
  const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // *** THÊM STATE CHO FILTERS ***
  const [filters, setFilters] = useState({
    searchTerm: '',
    status: '',
    startDate: '',
    endDate: '',
  });

  const [isDetailsModalOpen, setDetailsModalOpen] = useState(false);
  const [isConfirmModalOpen, setConfirmModalOpen] = useState(false);

  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(false);
  
  const [invoiceToCompleteId, setInvoiceToCompleteId] = useState(null);
  const [isCompleting, setIsCompleting] = useState(false);

  // *** CẬP NHẬT fetchInvoices ĐỂ DÙNG FILTERS ***
  const fetchInvoices = useCallback(async (page = 1, currentFilters = filters) => {
    setLoading(true);
    setError(null);
    try {
      // Loại bỏ các giá trị rỗng khỏi bộ lọc trước khi gửi đi
      const activeFilters = Object.entries(currentFilters).reduce((acc, [key, value]) => {
        if (value) acc[key] = value;
        return acc;
      }, {});
      
      const data = await importInvoiceApiService.getImportInvoices({ page, limit: 10, ...activeFilters });
      setInvoices(data.invoices);
      setPagination({ currentPage: data.currentPage, totalPages: data.totalPages });
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  }, [filters]); // Thêm filters vào dependency array

  useEffect(() => {
    fetchInvoices(1);
  }, [fetchInvoices]);

  const handleOpenDetails = async (invoiceId) => {
    setDetailsModalOpen(true);
    setLoadingDetails(true);
    setSelectedInvoice(null);
    try {
      const data = await importInvoiceApiService.getImportInvoiceById(invoiceId);
      setSelectedInvoice(data);
      return data; // Trả về dữ liệu để các hàm khác có thể dùng
    } catch (err) {
      setError(err.message);
      toast.error(`Lỗi khi tải chi tiết: ${err.message}`);
      setDetailsModalOpen(false);
    } finally {
      setLoadingDetails(false);
    }
    return null;
  };

  const handleOpenConfirmComplete = (invoiceId) => {
    setInvoiceToCompleteId(invoiceId);
    setConfirmModalOpen(true);
  };
  
  const handleConfirmComplete = async () => {
    if (!invoiceToCompleteId) return;
    setIsCompleting(true);
    try {
      const response = await importInvoiceApiService.completeImportInvoice(invoiceToCompleteId);
      toast.success(response.message);
      setConfirmModalOpen(false);
      fetchInvoices(pagination.currentPage);
    } catch (err) {
      toast.error(`Lỗi: ${err.message}`);
    } finally {
      setIsCompleting(false);
      setInvoiceToCompleteId(null);
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= pagination.totalPages && newPage !== pagination.currentPage) {
      fetchInvoices(newPage);
    }
  };

  // *** HÀM MỚI CHO BỘ LỌC ***
  const handleSearch = (newFilters) => {
    setPagination(p => ({ ...p, currentPage: 1 }));
    setFilters(newFilters);
    fetchInvoices(1, newFilters);
  };

  // *** HÀM MỚI ĐỂ XỬ LÝ IN VÀ XUẤT EXCEL ***
  const handlePrint = async (invoiceId) => {
    await handleOpenDetails(invoiceId);
    // Modal sẽ tự có nút In
  };

  const handleExport = async (invoiceId) => {
    toast.info("Đang chuẩn bị file Excel...");
    try {
      // Cần lấy dữ liệu đầy đủ của hóa đơn trước khi xuất
      const invoiceData = await importInvoiceApiService.getImportInvoiceById(invoiceId);
      if (invoiceData) {
        exportInvoiceToExcel(invoiceData);
      }
    } catch (err) {
      toast.error(`Không thể xuất Excel: ${err.message}`);
    }
  };


  return (
    <div className="container mx-auto p-4 md:p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Quản lý Hóa đơn nhập</h1>
        <Link
          to="/imports/new"
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg flex items-center space-x-2 transition duration-300"
        >
          <PlusIcon className="h-5 w-5" />
          <span>Thêm hóa đơn nhập</span>
        </Link>
      </div>

      {/* *** THÊM FILTER BAR VÀO GIAO DIỆN *** */}
      <FilterBar filters={filters} setFilters={setFilters} onSearch={handleSearch} />

      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">{error}</div>}

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {/* *** TRUYỀN CÁC HÀM XỬ LÝ MỚI XUỐNG TABLE *** */}
        <ImportInvoiceTable
          invoices={invoices}
          loading={loading}
          onOpenDetails={handleOpenDetails}
          onConfirmComplete={handleOpenConfirmComplete}
          onPrint={handlePrint}
          onExport={handleExport}
        />
      </div>
      
      {pagination.totalPages > 1 && (
        <Pagination
          currentPage={pagination.currentPage}
          totalPages={pagination.totalPages}
          onPageChange={handlePageChange}
        />
      )}

      <ImportInvoiceDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={() => setDetailsModalOpen(false)}
        invoice={selectedInvoice}
        loading={loadingDetails}
      />

      <CompleteInvoiceConfirmModal
        isOpen={isConfirmModalOpen}
        onClose={() => !isCompleting && setConfirmModalOpen(false)}
        onConfirm={handleConfirmComplete}
        invoiceId={invoiceToCompleteId}
        isCompleting={isCompleting}
      />
    </div>
  );
}

export default ImportInvoiceManagement;