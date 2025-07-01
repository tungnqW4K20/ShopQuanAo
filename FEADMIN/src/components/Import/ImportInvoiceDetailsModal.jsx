import React from 'react';
import { AiOutlineClose } from 'react-icons/ai';
import { formatDate, formatCurrency, getInvoiceStatusInfo} from '../../utils/formatting';

function ImportInvoiceDetailsModal({ isOpen, onClose, invoice, loading }) {
  if (!isOpen) return null;

  const totalAmount = invoice?.total_amount || 0;
  const statusInfo = invoice ? getInvoiceStatusInfo(invoice.import_status) : {};

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-semibold text-gray-800">
            Chi tiết Hóa đơn nhập #{loading ? '...' : invoice?.id || ''}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><AiOutlineClose size={24} /></button>
        </div>

        <div className="p-6 space-y-4 overflow-y-auto flex-grow">
          {loading ? (
            <div className="flex justify-center items-center h-full">
              <p className="text-gray-500">Đang tải chi tiết hóa đơn...</p>
            </div>
           ) : (
            invoice && <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                <div>
                  <h3 className="text-md font-semibold text-gray-700 mb-1">Thông tin Nhà Cung Cấp</h3>
                  <p><strong>Tên:</strong> {invoice.supplier?.name || 'N/A'}</p>
                  <p><strong>Email:</strong> {invoice.supplier?.email || 'N/A'}</p>
                  <p><strong>SĐT:</strong> {invoice.supplier?.phonenumber || 'N/A'}</p>
                </div>
                <div>
                  <h3 className="text-md font-semibold text-gray-700 mb-1">Thông tin Hóa Đơn</h3>
                  <p><strong>Ngày nhập:</strong> {formatDate(invoice.import_date)}</p>
                  <p><strong>Trạng thái:</strong> <span className={statusInfo.className}>{statusInfo.text}</span></p>
                  <p><strong>Tổng giá trị:</strong> <span className="font-bold text-indigo-600">{formatCurrency(totalAmount)}</span></p>
                </div>
              </div>

              <h3 className="text-md font-semibold text-gray-700 mb-2">Chi tiết Sản phẩm nhập</h3>
              <div className="overflow-x-auto border rounded-lg">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                    <tr>
                      <th className="px-4 py-3">Sản phẩm</th>
                      <th className="px-4 py-3">Màu/Size</th>
                      <th className="px-4 py-3 text-center">Số lượng</th>
                      <th className="px-4 py-3 text-right">Đơn giá</th>
                      <th className="px-4 py-3 text-right">Thành tiền</th>
                    </tr>
                  </thead>
                  <tbody>
                    {invoice.details?.map(item => (
                      <tr key={item.id} className="bg-white border-b">
                        <td className="px-4 py-3 font-medium text-gray-900">{item.Product?.name || 'N/A'}</td>
                        <td className="px-4 py-3">{item.ColorProduct?.name || ''} / {item.SizeProduct?.name || ''}</td>
                        <td className="px-4 py-3 text-center">{item.quantity}</td>
                        <td className="px-4 py-3 text-right">{formatCurrency(item.price)}</td>
                        <td className="px-4 py-3 text-right font-semibold">{formatCurrency(parseFloat(item.price) * item.quantity)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
        <div className="p-4 border-t flex justify-end bg-gray-50 rounded-b-lg">
          <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">Đóng</button>
        </div>
      </div>
    </div>
  );
}

export default ImportInvoiceDetailsModal;