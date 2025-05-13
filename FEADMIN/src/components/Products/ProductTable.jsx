import React from 'react';
import { AiOutlineEdit, AiOutlineDelete } from 'react-icons/ai';

const ProductTable = ({ products, onEdit, onDelete }) => {

  const formatPrice = (price) => {
    if (price === null || price === undefined || isNaN(parseFloat(price))) return 'N/A';
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  return (
    <div className="overflow-x-auto relative shadow-md sm:rounded-lg bg-white">
      <table className="w-full text-sm text-left text-gray-500">
        <thead className="text-xs text-gray-700 uppercase bg-gray-100">
          <tr>
            <th scope="col" className="py-3 px-4">ID</th>
            <th scope="col" className="py-3 px-4">Ảnh</th>
            <th scope="col" className="py-3 px-6">Tên Sản phẩm</th>
            <th scope="col" className="py-3 px-4">Giá</th>
            <th scope="col" className="py-3 px-4">Danh mục</th>
            <th scope="col" className="py-3 px-6">Mô tả</th>
            {/* Ngày tạo and Ngày cập nhật columns removed */}
            <th scope="col" className="py-3 px-6 text-right">Hành động</th>
          </tr>
        </thead>
        <tbody>
          {products.length === 0 ? (
            <tr className="bg-white border-b">
              {/* Adjusted colSpan since two columns were removed */}
              <td colSpan="7" className="py-4 px-6 text-center text-gray-500">
                Không tìm thấy sản phẩm nào.
              </td>
            </tr>
          ) : (
            products.map((product) => (
              <tr key={product.id} className="bg-white border-b hover:bg-gray-50 align-middle">
                <td className="py-3 px-4 font-medium text-gray-900 whitespace-nowrap">{product.id}</td>
                <td className="py-3 px-4">
                  {product.image_url ? (
                    <img
                      src={product.image_url}
                      alt={product.name || 'Ảnh sản phẩm'}
                      className="h-16 w-16 object-contain rounded border border-gray-200" // Changed to object-contain and added border
                      onError={(e) => {
                        // Fallback if image fails to load
                        e.currentTarget.onerror = null; // Prevent infinite loop if fallback also fails
                        e.currentTarget.src = "https://via.placeholder.com/64?text=No+Image"; // Placeholder image
                        e.currentTarget.alt = "Không tải được ảnh";
                      }}
                    />
                  ) : (
                    <div className="h-16 w-16 bg-gray-200 rounded flex items-center justify-center text-xs text-gray-500 border border-gray-200">
                      No Img
                    </div>
                  )}
                </td>
                <td className="py-3 px-6 text-gray-800 font-medium min-w-[200px]">{product.name}</td>
                <td className="py-3 px-4 whitespace-nowrap">{formatPrice(product.price)}</td>
                <td className="py-3 px-4">{product.category ? product.category.name : 'N/A'}</td>
                <td className="py-3 px-6 text-xs max-w-[250px] break-words" title={product.description}> {/* Changed truncate to break-words */}
                  {product.description}
                </td>
                {/* Ngày tạo and Ngày cập nhật columns removed */}
                <td className="py-3 px-6 text-right space-x-2 whitespace-nowrap">
                  <button
                    onClick={() => onEdit(product)}
                    className="font-medium text-indigo-600 hover:text-indigo-800 transition duration-150 ease-in-out p-1 rounded hover:bg-indigo-100"
                    title="Sửa sản phẩm"
                  >
                    <AiOutlineEdit size={18} />
                  </button>
                  <button
                    onClick={() => onDelete(product)}
                    className="font-medium text-red-600 hover:text-red-800 transition duration-150 ease-in-out p-1 rounded hover:bg-red-100"
                    title="Xóa sản phẩm"
                  >
                    <AiOutlineDelete size={18}/>
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ProductTable;