// src/components/Order/OrderDetailModal.jsx
import React from 'react';
import OrderDetailView from './OrderDetailView';

// Props loadingOrderDetails và orderDetailsError dành cho trường hợp
// component cha (ManageOrdersPage) fetch chi tiết cụ thể cho modal này.
// Nếu order prop đã chứa đầy đủ thông tin thì không cần chúng.
function OrderDetailModal({ isOpen, onClose, order, loadingOrderDetails, orderDetailsError }) {
  if (!isOpen) return null; // Đóng modal nếu không isOpen

  // Nếu order là null (chưa có dữ liệu) và không đang loading/error, cũng không hiển thị gì.
  // Điều này quan trọng để tránh lỗi khi order ban đầu là null.
  // if (!order && !loadingOrderDetails && !orderDetailsError) return null;


  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black bg-opacity-75 transition-opacity duration-300 ease-in-out overflow-y-auto p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl md:max-w-4xl transform transition-all duration-300 ease-in-out scale-100 my-auto">
        <div className="flex justify-between items-center p-4 md:p-5 border-b rounded-t">
          <h3 className="text-xl font-semibold text-gray-900">
            {/* Hiển thị ID nếu order có, nếu không thì tiêu đề chung */}
            {order ? `Chi tiết Đơn hàng #${order.id}` : 'Chi tiết Đơn hàng'}
          </h3>
          <button
            type="button"
            className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center"
            onClick={onClose}
          >
            <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
            </svg>
            <span className="sr-only">Đóng modal</span>
          </button>
        </div>

        <div className="p-0 max-h-[70vh] md:max-h-[75vh] overflow-y-auto">
          {/* 
            Truyền order, loadingOrderDetails, và orderDetailsError vào OrderDetailView.
            OrderDetailView sẽ tự xử lý việc hiển thị dựa trên các props này.
          */}
          <OrderDetailView 
            order={order} 
            loading={loadingOrderDetails} 
            error={orderDetailsError} 
          />
        </div>

        <div className="flex items-center justify-end p-4 md:p-5 border-t border-gray-200 rounded-b">
          <button
            onClick={onClose}
            type="button"
            className="py-2.5 px-5 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}

export default OrderDetailModal;