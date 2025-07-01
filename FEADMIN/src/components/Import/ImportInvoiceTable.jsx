// src/components/admin/ImportInvoiceTable.jsx
import React from 'react';
import { AiOutlineEye, AiOutlineCheckCircle } from 'react-icons/ai';
import { formatDate, formatCurrency, getInvoiceStatusInfo } from '../../utils/formatting';

function ImportInvoiceTable({ invoices, onOpenDetails, onConfirmComplete, loading }) {
  
  if (loading) {
    return (
      <div className="text-center p-10 text-gray-500">
        Đang tải danh sách hóa đơn...
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-left text-gray-500">
        <thead className="text-xs text-gray-700 uppercase bg-gray-100">
          <tr>
            <th scope="col" className="py-3 px-6">ID Hóa đơn</th>
            <th scope="col" className="py-3 px-6">Nhà Cung Cấp</th>
            <th scope="col" className="py-3 px-6">Ngày Nhập</th>
            <th scope="col" className="py-3 px-6">Tổng tiền</th>
            <th scope="col" className="py-3 px-6">Trạng thái</th>
            <th scope="col" className="py-3 px-6 text-right">Hành động</th>
          </tr>
        </thead>
        <tbody>
          {invoices.length === 0 ? (
            <tr className="bg-white border-b">
              <td colSpan="6" className="py-4 px-6 text-center text-gray-500">
                Không tìm thấy hóa đơn nhập nào.
              </td>
            </tr>
          ) : (
            invoices.map((invoice) => {
              const statusInfo = getInvoiceStatusInfo(invoice.import_status);
              return (
                <tr key={invoice.id} className="bg-white border-b hover:bg-gray-50">
                  <td className="py-4 px-6 font-medium text-gray-900">#{invoice.id}</td>
                  <td className="py-4 px-6">{invoice.supplier?.name || 'N/A'}</td>
                  <td className="py-4 px-6">{formatDate(invoice.import_date)}</td>
                  <td className="py-4 px-6 font-semibold">{formatCurrency(invoice.total_amount)}</td>
                  <td className="py-4 px-6"><span className={statusInfo.className}>{statusInfo.text}</span></td>
                  <td className="py-4 px-6 text-right space-x-2">
                    <button
                      onClick={() => onOpenDetails(invoice.id)}
                      className="text-blue-600 hover:text-blue-800 p-1 rounded hover:bg-blue-100" title="Xem chi tiết"
                    >
                      <AiOutlineEye size={20} />
                    </button>
                    {String(invoice.import_status) === '0' && (
                      <button
                        onClick={() => onConfirmComplete(invoice.id)}
                        className="text-green-600 hover:text-green-800 p-1 rounded hover:bg-green-100" title="Hoàn thành Hóa đơn"
                      >
                        <AiOutlineCheckCircle size={20} />
                      </button>
                    )}
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