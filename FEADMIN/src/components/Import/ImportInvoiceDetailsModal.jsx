// src/components/Import/ImportInvoiceDetailsModal.js
import React from 'react';
import { AiOutlineClose } from 'react-icons/ai';
import { PrinterIcon } from '@heroicons/react/24/solid';
import { formatDate, formatCurrency, getInvoiceStatusInfo } from '../../utils/formatting';

// Component con để hiển thị một dòng thông tin, giúp code gọn gàng hơn
const InfoRow = ({ label, value, valueClassName = '' }) => (
  <div className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
    <p className="text-sm text-gray-500">{label}</p>
    <p className={`text-sm font-semibold text-gray-800 text-right ${valueClassName}`}>{value}</p>
  </div>
);

function ImportInvoiceDetailsModal({ isOpen, onClose, invoice, loading }) {
  if (!isOpen) return null;

  // Logic tính toán và lấy thông tin trạng thái vẫn được giữ nguyên
  const totalAmount = invoice?.details?.reduce((sum, item) => sum + (parseFloat(item.price) * item.quantity), 0) || 0;
  const statusInfo = invoice ? getInvoiceStatusInfo(invoice.import_status) : {};

  // Hàm xử lý khi nhấn nút in
  const handlePrint = () => {
    window.print();
  };

  return (
    <>
      {/* Lớp phủ nền - Sẽ bị ẩn khi in */}
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 p-4 transition-opacity duration-300 print:hidden">
        {/* Thẻ Modal chính, tăng max-w-5xl để rộng hơn */}
        <div className="bg-gray-50 rounded-xl shadow-2xl w-full max-w-5xl max-h-[95vh] flex flex-col transform transition-all duration-300 scale-95 opacity-0 animate-fade-in-scale">
          
          {/* Header của Modal */}
          <div className="flex justify-between items-center p-5 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900">
              Chi tiết Hóa đơn nhập #{loading ? '...' : invoice?.id || ''}
            </h2>
            <button onClick={onClose} className="p-2 rounded-full text-gray-500 hover:bg-gray-200 hover:text-gray-800 transition-colors">
              <AiOutlineClose size={20} />
            </button>
          </div>

          {/* Nội dung chính của Modal */}
          <div className="p-6 space-y-6 overflow-y-auto flex-grow">
            {loading ? (
              // Giao diện khi đang tải dữ liệu
              <div className="flex flex-col justify-center items-center h-full py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                <p className="mt-4 text-gray-600">Đang tải chi tiết hóa đơn...</p>
              </div>
            ) : (
              // Giao diện khi đã có dữ liệu
              invoice && <>
                {/* Phần thông tin chung */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 bg-white p-6 rounded-lg border border-gray-200">
                  {/* Cột thông tin nhà cung cấp */}
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">Thông tin Nhà Cung Cấp</h3>
                    <InfoRow label="Tên NCC" value={invoice.supplier?.name || 'N/A'} />
                    <InfoRow label="Email" value={invoice.supplier?.email || 'N/A'} />
                    <InfoRow label="Số điện thoại" value={invoice.supplier?.phonenumber || 'N/A'} />
                  </div>
                  {/* Cột thông tin hóa đơn */}
                  <div className="space-y-2">
                     <h3 className="text-lg font-semibold text-gray-800 mb-3">Thông tin Hóa Đơn</h3>
                     <InfoRow label="Ngày nhập" value={formatDate(invoice.import_date)} />
                     <InfoRow label="Trạng thái" value={<span className={statusInfo.className}>{statusInfo.text}</span>} />
                     <InfoRow 
                       label="Tổng giá trị" 
                       value={formatCurrency(totalAmount)} 
                       valueClassName="!text-xl !font-bold !text-indigo-600"
                     />
                  </div>
                </div>

                {/* Phần bảng chi tiết sản phẩm */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Chi tiết Sản phẩm nhập</h3>
                  <div className="overflow-hidden border border-gray-200 rounded-lg">
                    <table className="w-full text-sm text-left">
                      <thead className="text-xs text-gray-600 uppercase bg-gray-100">
                        <tr>
                          <th className="px-6 py-4 font-semibold">Sản phẩm</th>
                          <th className="px-6 py-4 font-semibold">Phân loại (Màu/Size)</th>
                          <th className="px-6 py-4 font-semibold text-center">Số lượng</th>
                          <th className="px-6 py-4 font-semibold text-right">Đơn giá</th>
                          <th className="px-6 py-4 font-semibold text-right">Thành tiền</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {invoice.details?.length > 0 ? (
                          invoice.details.map(item => (
                            <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                              <td className="px-6 py-4 font-medium text-gray-900">{item.Product?.name || 'Sản phẩm không tồn tại'}</td>
                              <td className="px-6 py-4 text-gray-600">{item.ColorProduct?.name || 'N/A'} / {item.SizeProduct?.name || 'N/A'}</td>
                              <td className="px-6 py-4 text-center text-gray-600">{item.quantity}</td>
                              <td className="px-6 py-4 text-right text-gray-600">{formatCurrency(item.price)}</td>
                              <td className="px-6 py-4 text-right font-bold text-gray-800">{formatCurrency(parseFloat(item.price) * item.quantity)}</td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="5" className="text-center py-10 text-gray-500">Không có chi tiết sản phẩm.</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Footer của Modal */}
          <div className="p-4 border-t border-gray-200 flex justify-between items-center bg-white rounded-b-xl">
            {/* Nút In mới */}
            <button 
              type="button" 
              onClick={handlePrint}
              disabled={loading || !invoice}
              className="flex items-center space-x-2 px-5 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              <PrinterIcon className="h-5 w-5" />
              <span>In hóa đơn</span>
            </button>
            
            {/* Nút Đóng */}
            <button type="button" onClick={onClose} className="px-5 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-all">
              Đóng
            </button>
          </div>
        </div>
      </div>

      {/* CSS DÀNH RIÊNG CHO VIỆC IN và ANIMATION */}
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .printable-area, .printable-area * {
            visibility: visible;
          }
          .printable-area {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            height: auto;
          }
        }
        @keyframes fade-in-scale {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fade-in-scale {
          animation: fade-in-scale 0.2s ease-out forwards;
        }
      `}</style>
      
      {/* Khu vực có thể in (luôn tồn tại trong DOM nhưng chỉ hiển thị khi in) */}
      <div className="hidden print:block printable-area p-8 font-sans">
        {invoice && (
          <div className="space-y-8">
            <header className="text-center">
              <h1 className="text-3xl font-bold text-black">HÓA ĐƠN NHẬP HÀNG</h1>
              <p className="text-gray-600">Mã hóa đơn: #{invoice.id}</p>
            </header>

            <section className="grid grid-cols-2 gap-8 pt-4 border-t mt-4">
              <div>
                <h3 className="text-lg font-semibold text-black">Nhà cung cấp</h3>
                <p><strong>Tên:</strong> {invoice.supplier?.name || 'N/A'}</p>
                <p><strong>Email:</strong> {invoice.supplier?.email || 'N/A'}</p>
                <p><strong>SĐT:</strong> {invoice.supplier?.phonenumber || 'N/A'}</p>
              </div>
              <div className="text-right">
                <h3 className="text-lg font-semibold text-black">Thông tin</h3>
                <p><strong>Ngày nhập:</strong> {formatDate(invoice.import_date)}</p>
                <p><strong>Trạng thái:</strong> {statusInfo.text}</p>
              </div>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-black mb-2">Chi tiết sản phẩm</h3>
              <table className="w-full text-sm text-left border-collapse">
                  <thead className="border-y-2 border-black">
                      <tr>
                          <th className="p-2">Sản phẩm</th>
                          <th className="p-2">Phân loại</th>
                          <th className="p-2 text-center">Số lượng</th>
                          <th className="p-2 text-right">Đơn giá</th>
                          <th className="p-2 text-right">Thành tiền</th>
                      </tr>
                  </thead>
                  <tbody>
                      {invoice.details?.map(item => (
                        <tr key={`print-${item.id}`} className="border-b">
                            <td className="p-2">{item.Product?.name || 'N/A'}</td>
                            <td className="p-2">{item.ColorProduct?.name || ''} / {item.SizeProduct?.name || ''}</td>
                            <td className="p-2 text-center">{item.quantity}</td>
                            <td className="p-2 text-right">{formatCurrency(item.price)}</td>
                            <td className="p-2 text-right font-medium">{formatCurrency(parseFloat(item.price) * item.quantity)}</td>
                        </tr>
                      ))}
                  </tbody>
                  <tfoot className="font-bold border-t-2 border-black">
                      <tr>
                          <td colSpan="4" className="p-2 text-right text-base">TỔNG CỘNG:</td>
                          <td className="p-2 text-right text-xl">{formatCurrency(totalAmount)}</td>
                      </tr>
                  </tfoot>
              </table>
            </section>
            
            <footer className="pt-12 text-center text-sm text-gray-500">
              <p>Xin cảm ơn và hẹn gặp lại!</p>
            </footer>
          </div>
        )}
      </div>
    </>
  );
}

export default ImportInvoiceDetailsModal;