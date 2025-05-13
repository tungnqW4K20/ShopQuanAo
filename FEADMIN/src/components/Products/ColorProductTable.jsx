import React from 'react';
import { FaEdit, FaTrash, FaTrashRestore, FaEyeSlash } from 'react-icons/fa';
import { AiOutlinePlus } from 'react-icons/ai';

function ColorProductTable({
  colorProducts,
  onAdd,
  onEdit,
  onSoftDelete,
  onHardDelete,
  onRestore,
  showSoftDeleted
}) {
  if (!colorProducts || colorProducts.length === 0) {
    return (
      <div className="text-center py-4">
        <p className="text-gray-500">Chưa có biến thể màu nào cho sản phẩm này.</p>
        <button
          onClick={onAdd}
          className="mt-2 inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <AiOutlinePlus className="mr-2 h-4 w-4" /> Thêm Biến Thể Màu
        </button>
      </div>
    );
  }

  return (
    <div className="shadow border-b border-gray-200 sm:rounded-lg overflow-x-auto">
      <div className="flex justify-between items-center p-3 bg-gray-50">
        <h3 className="text-lg font-semibold text-gray-700">Biến Thể Màu</h3>
        <button
          onClick={onAdd}
          className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <AiOutlinePlus className="mr-2 h-4 w-4" /> Thêm Mới
        </button>
      </div>
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-100">
          <tr>
            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tên Màu</th>
            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Giá (+/-)</th>
            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ảnh</th>
            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng Thái</th>
            <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Hành động</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {colorProducts.map((cp) => (
            <tr key={cp.id} className={`${cp.deletedAt ? 'bg-red-50 opacity-70' : ''}`}>
              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">{cp.name}</td>
              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                {cp.price !== null && cp.price !== undefined ? `${Number(cp.price).toLocaleString()} VNĐ` : 'Không đổi'}
              </td>
              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                {cp.image_urls && cp.image_urls.length > 0 ? (
                  <img src={cp.image_urls[0]} alt={cp.name} className="h-10 w-10 object-cover rounded" />
                ) : (
                  'Không có'
                )}
              </td>
              <td className="px-4 py-3 whitespace-nowrap text-sm">
                {cp.deletedAt ? (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                    <FaEyeSlash className="mr-1" /> Đã xóa mềm
                  </span>
                ) : (
                  <span className="px-2.5 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                    Hoạt động
                  </span>
                )}
              </td>
              <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium space-x-2">
                {!cp.deletedAt && (
                  <>
                    <button onClick={() => onEdit(cp)} className="text-indigo-600 hover:text-indigo-900" title="Sửa">
                      <FaEdit />
                    </button>
                    <button onClick={() => onSoftDelete(cp)} className="text-yellow-600 hover:text-yellow-900" title="Xóa mềm">
                      <FaEyeSlash />
                    </button>
                  </>
                )}
                {showSoftDeleted && cp.deletedAt && ( // Show these actions only if showSoftDeleted is true for this cp
                   <button onClick={() => onRestore(cp)} className="text-green-600 hover:text-green-900" title="Khôi phục">
                     <FaTrashRestore />
                   </button>
                )}
                 <button onClick={() => onHardDelete(cp)} className="text-red-600 hover:text-red-900" title="Xóa vĩnh viễn">
                   <FaTrash />
                 </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ColorProductTable;