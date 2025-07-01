import React, { useState, useEffect, useCallback } from 'react';
import importInvoiceApiService from '../services/importInvoiceApiService';
import ImportInvoiceTable from '../components/Import/ImportInvoiceTable';
import ImportInvoiceDetailsModal from '../components/Import/ImportInvoiceDetailsModal';
import CompleteInvoiceConfirmModal from '../components/Import/CompleteInvoiceConfirmModal';
import Pagination from '../components/shared/Pagination'; 
import { toast } from 'react-toastify'; 

function ImportInvoiceManagement() {
  const [invoices, setInvoices] = useState([]);
  const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isDetailsModalOpen, setDetailsModalOpen] = useState(false);
  const [isConfirmModalOpen, setConfirmModalOpen] = useState(false);

  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(false);
  
  const [invoiceToCompleteId, setInvoiceToCompleteId] = useState(null);
  const [isCompleting, setIsCompleting] = useState(false);

  const fetchInvoices = useCallback(async (page = 1) => {
    setLoading(true);
    setError(null);
    try {
      const data = await importInvoiceApiService.getImportInvoices({ page, limit: 10 });
      setInvoices(data.invoices);
      setPagination({ currentPage: data.currentPage, totalPages: data.totalPages });
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

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
    } catch (err) {
      setError(err.message);
      toast.error(`Lỗi khi tải chi tiết: ${err.message}`);
      setDetailsModalOpen(false);
    } finally {
      setLoadingDetails(false);
    }
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

  return (
    <div className="container mx-auto p-4 md:p-6 space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Quản lý Hóa đơn nhập</h1>

      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">{error}</div>}

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <ImportInvoiceTable
          invoices={invoices}
          loading={loading}
          onOpenDetails={handleOpenDetails}
          onConfirmComplete={handleOpenConfirmComplete}
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