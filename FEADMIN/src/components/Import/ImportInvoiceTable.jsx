// src/components/Import/ImportInvoiceTable.js
import React from 'react';
import { formatDate, formatCurrency, getInvoiceStatusInfo } from '../../utils/formatting';
// *** THÊM ICONS ***
import { EyeIcon, CheckCircleIcon, PrinterIcon, DocumentArrowDownIcon } from '@heroicons/react/24/outline';

function ImportInvoiceTable({ invoices, loading, onOpenDetails, onConfirmComplete, onPrint, onExport }) {
  // ... (Giao diện khi đang tải và khi không có dữ liệu giữ nguyên) ...

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mã HĐ</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nhà Cung Cấp</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ngày Nhập</th>
            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Tổng Tiền</th>
            <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng Thái</th>
            {/* *** THÊM CỘT HÀNH ĐỘNG *** */}
            <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Hành Động</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {loading ? (
            <tr><td colSpan="6" className="text-center py-4">Đang tải dữ liệu...</td></tr>
          ) : invoices.length === 0 ? (
            <tr><td colSpan="6" className="text-center py-4">Không tìm thấy hóa đơn nào.</td></tr>
          ) : (
            invoices.map(invoice => {
              const statusInfo = getInvoiceStatusInfo(invoice.import_status);
              return (
                <tr key={invoice.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">#{invoice.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{invoice.supplier?.name || 'N/A'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(invoice.import_date)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right font-semibold">{formatCurrency(invoice.total_amount || 0)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                    <span className={statusInfo.className}>{statusInfo.text}</span>
                  </td>
                  {/* *** THÊM CÁC NÚT HÀNH ĐỘNG *** */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-center">
                    <div className="flex items-center justify-center space-x-2">
                      <button onClick={() => onOpenDetails(invoice.id)} className="text-blue-600 hover:text-blue-900" title="Xem chi tiết">
                        <EyeIcon className="h-5 w-5"/>
                      </button>
                      {invoice.import_status === '0' && (
                        <button onClick={() => onConfirmComplete(invoice.id)} className="text-green-600 hover:text-green-900" title="Hoàn thành hóa đơn">
                          <CheckCircleIcon className="h-5 w-5"/>
                        </button>
                      )}
                       <button onClick={() => onPrint(invoice.id)} className="text-gray-600 hover:text-gray-900" title="In hóa đơn">
                        <PrinterIcon className="h-5 w-5"/>
                      </button>
                      <button onClick={() => onExport(invoice.id)} className="text-teal-600 hover:text-teal-900" title="Xuất Excel">
                        <DocumentArrowDownIcon className="h-5 w-5"/>
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}

export default ImportInvoiceTable;