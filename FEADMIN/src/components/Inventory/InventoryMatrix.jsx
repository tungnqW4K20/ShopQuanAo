// src/components/Products/InventoryMatrix.js
import React from 'react';

function InventoryMatrix({ colors, sizes, inventory, onQuantityChange }) {
  const getQuantity = (colorId, sizeId) => {
    const item = inventory.find(
      (inv) => inv.color_product_id === colorId && inv.size_product_id === sizeId
    );
    return item ? item.quantity : 0;
  };

  if (colors.length === 0 || sizes.length === 0) {
    return (
      <div className="text-center py-4 text-gray-500">
        Vui lòng thêm ít nhất một biến thể màu và một biến thể kích thước để quản lý tồn kho.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto shadow rounded-lg">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-100">
          <tr>
            <th scope="col" className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider sticky left-0 bg-gray-100 z-10">
              Màu \ Kích thước
            </th>
            {sizes.map((size) => (
              <th key={size.id} scope="col" className="px-4 py-3 text-center text-xs font-bold text-gray-600 uppercase tracking-wider">
                {size.name}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {colors.map((color) => (
            <tr key={color.id}>
              <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-800 sticky left-0 bg-white z-10">
                {color.name}
              </td>
              {sizes.map((size) => (
                <td key={size.id} className="px-2 py-1 whitespace-nowrap text-sm text-gray-500">
                  <input
                    type="number"
                    min="0"
                    value={getQuantity(color.id, size.id)}
                    onChange={(e) => onQuantityChange(color.id, size.id, parseInt(e.target.value, 10) || 0)}
                    className="w-20 text-center border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default InventoryMatrix;