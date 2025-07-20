import React from 'react';
import { Link } from 'react-router-dom';

// Hàm định dạng giá tiền
const formatPrice = (value) => {
  if (value === null || value === undefined) return '0đ';
  return Number(value).toLocaleString('vi-VN') + 'đ';
};

const CartPopup = ({ items = [], onClose }) => {
  if (!items || items.length === 0) {
    return null; // Không hiển thị gì nếu không có sản phẩm
  }

  // Tính tổng tiền tạm tính
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="absolute top-full right-0 mt-2 w-80 bg-white rounded-lg shadow-2xl border border-gray-200 z-50 animate-fade-in-down">
      <div className="p-4">
        {/* Phần đầu của popup */}
        <div className="flex justify-between items-center mb-3">
          <p className="text-sm text-gray-500">
            Tạm tính: <span className="font-bold text-gray-800">{formatPrice(subtotal)}</span> ({items.length} sản phẩm)
          </p>
          <Link to="/cart" onClick={onClose} className="text-sm font-semibold text-blue-600 hover:text-blue-800">
            Xem tất cả
          </Link>
        </div>

        {/* Danh sách sản phẩm */}
        <ul className="divide-y divide-gray-100 max-h-64 overflow-y-auto pr-2 -mr-2">
          {items.map(item => (
            <li key={item.id} className="flex py-3">
              <img src={item.image} alt={item.name} className="h-16 w-16 rounded-md object-cover" />
              <div className="ml-3 flex-1 flex flex-col justify-between">
                <div>
                  <h4 className="text-sm font-medium text-gray-800 leading-tight">
                    <Link to={`/products/${item.productId}`} onClick={onClose} className="hover:text-blue-600">
                      {item.name}
                    </Link>
                  </h4>
                  <p className="mt-1 text-xs text-gray-500">{item.color} / {item.size}</p>
                </div>
                <div className="flex items-baseline justify-between mt-1">
                   <p className="text-sm font-semibold text-gray-900">{formatPrice(item.price)}</p>
                   {item.originalPrice > item.price && (
                      <p className="text-xs text-gray-400 line-through">{formatPrice(item.originalPrice)}</p>
                   )}
                </div>
              </div>
              <button onClick={() => console.log('Remove item', item.id)} className="ml-2 text-gray-400 hover:text-red-500 text-lg">
                ×
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default CartPopup;