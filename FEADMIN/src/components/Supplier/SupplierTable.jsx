import React from 'react';
import { AiOutlineEdit, AiOutlineDelete } from 'react-icons/ai';

function SupplierTable({ suppliers, onEdit, onDelete }) {
  if (!suppliers || suppliers.length === 0) {
    return <p className="text-center text-gray-500 py-4">Không có nhà cung cấp nào.</p>;
  }

  return (
    <div className="overflow-x-auto bg-white shadow-md rounded-lg">
      <table className="min-w-full leading-normal">
        <thead>
          <tr className="bg-gray-100 text-left text-gray-600 uppercase text-sm leading-normal">
            <th className="py-3 px-6">Tên Nhà Cung Cấp</th>
            <th className="py-3 px-6">Email</th>
            <th className="py-3 px-6">Số Điện Thoại</th>
            <th className="py-3 px-6 text-center">Hành Động</th>
          </tr>
        </thead>
        <tbody className="text-gray-700 text-sm font-light">
          {suppliers.map((supplier) => (
            <tr key={supplier.id} className="border-b border-gray-200 hover:bg-gray-50">
              <td className="py-3 px-6 whitespace-nowrap">{supplier.name}</td>
              <td className="py-3 px-6">{supplier.email}</td>
              <td className="py-3 px-6">{supplier.phonenumber}</td>
              <td className="py-3 px-6 text-center">
                <button
                  onClick={() => onEdit(supplier)}
                  className="text-indigo-600 hover:text-indigo-900 mr-4 transition duration-150 ease-in-out"
                  aria-label="Chỉnh sửa"
                >
                  <AiOutlineEdit size={20} />
                </button>
                <button
                  onClick={() => onDelete(supplier)}
                  className="text-red-500 hover:text-red-700 transition duration-150 ease-in-out"
                  aria-label="Xóa"
                >
                  <AiOutlineDelete size={20} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default SupplierTable;