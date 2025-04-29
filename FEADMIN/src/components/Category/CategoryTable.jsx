// src/components/admin/CategoryTable.jsx
import React from 'react';
import { AiOutlineEdit, AiOutlineDelete } from 'react-icons/ai';

function CategoryTable({ categories, onEdit, onDelete }) {

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    try {
        const options = { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' };
        return new Intl.DateTimeFormat('vi-VN', options).format(new Date(dateString));
    } catch (e) {
        console.error("Error formatting date:", dateString, e);
        return 'Invalid Date';
    }
  };

  return (
    <div className="overflow-x-auto relative shadow-md sm:rounded-lg bg-white">
      <table className="w-full text-sm text-left text-gray-500 ">
        <thead className="text-xs text-gray-700 uppercase bg-gray-100">
          <tr>
            <th scope="col" className="py-3 px-6">
              ID
            </th>
            <th scope="col" className="py-3 px-6">
              Tên Danh mục
            </th>
            <th scope="col" className="py-3 px-6">
              Ngày tạo
            </th>
            <th scope="col" className="py-3 px-6">
              Ngày cập nhật
            </th>
            <th scope="col" className="py-3 px-6 text-right">
              Hành động
            </th>
          </tr>
        </thead>
        <tbody>
          {categories.length === 0 ? (
            <tr className="bg-white border-b">
              <td colSpan="5" className="py-4 px-6 text-center text-gray-500">
                Không tìm thấy danh mục nào.
              </td>
            </tr>
          ) : (
            categories.map((category) => (
              <tr key={category.id} className="bg-white border-b hover:bg-gray-50">
                <td className="py-4 px-6 font-medium text-gray-900 whitespace-nowrap">
                  {category.id}
                </td>
                <td className="py-4 px-6 text-gray-800">
                  {category.name}
                </td>
                <td className="py-4 px-6">
                  {formatDate(category.createdAt)}
                </td>
                <td className="py-4 px-6">
                  {formatDate(category.updatedAt)}
                </td>
                <td className="py-4 px-6 text-right space-x-2 whitespace-nowrap">
                  <button
                    onClick={() => onEdit(category)}
                    className="font-medium text-indigo-600 hover:text-indigo-800 transition duration-150 ease-in-out p-1 rounded hover:bg-indigo-100"
                    title="Sửa danh mục"
                  >
                    <AiOutlineEdit size={18} />
                  </button>
                  <button
                    onClick={() => onDelete(category)}
                    className="font-medium text-red-600 hover:text-red-800 transition duration-150 ease-in-out p-1 rounded hover:bg-red-100"
                    title="Xóa danh mục"
                  >
                    <AiOutlineDelete size={18}/>
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
      {/* Có thể thêm phân trang ở đây nếu cần */}
    </div>
  );
}

export default CategoryTable;