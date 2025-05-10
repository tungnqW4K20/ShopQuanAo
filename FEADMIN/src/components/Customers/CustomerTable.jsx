import React from 'react';
import { FiEdit, FiTrash2 } from 'react-icons/fi';

const CustomerTable = ({ customers, onEdit, onDelete }) => {
  if (!customers || customers.length === 0) {
    return <p className="text-center text-gray-500">Không có khách hàng nào để hiển thị.</p>;
  }

  return (
    <div className="overflow-x-auto bg-white shadow-md rounded-lg">
      <table className="min-w-full leading-normal">
        <thead>
          <tr>
            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
              ID
            </th>
            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Tên Khách Hàng
            </th>
            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Email
            </th>
            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Địa chỉ
            </th>
            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Username
            </th>
            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Hành động
            </th>
          </tr>
        </thead>
        <tbody>
          {customers.map((customer) => (
            <tr key={customer.id} className="hover:bg-gray-50">
              <td className="px-5 py-4 border-b border-gray-200 bg-white text-sm">
                {customer.id}
              </td>
              <td className="px-5 py-4 border-b border-gray-200 bg-white text-sm">
                {customer.name}
              </td>
              <td className="px-5 py-4 border-b border-gray-200 bg-white text-sm">
                {customer.email}
              </td>
              <td className="px-5 py-4 border-b border-gray-200 bg-white text-sm">
                {customer.address}
              </td>
              <td className="px-5 py-4 border-b border-gray-200 bg-white text-sm">
                {customer.username}
              </td>
              <td className="px-5 py-4 border-b border-gray-200 bg-white text-sm">
                <button
                  onClick={() => onEdit(customer)}
                  className="text-indigo-600 hover:text-indigo-900 mr-3"
                  title="Sửa"
                >
                  <FiEdit size={18} />
                </button>
                <button
                  onClick={() => onDelete(customer)}
                  className="text-red-600 hover:text-red-900"
                  title="Xóa"
                >
                  <FiTrash2 size={18} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CustomerTable;