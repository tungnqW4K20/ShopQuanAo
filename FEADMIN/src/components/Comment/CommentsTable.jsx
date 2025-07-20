import React from 'react';
import { Link } from 'react-router-dom';
import { FaReply, FaTrashAlt, FaUserCircle, FaStore } from 'react-icons/fa';

const formatDate = (dateString) => {
    if (!dateString) return '-';
    const options = { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' };
    return new Intl.DateTimeFormat('vi-VN', options).format(new Date(dateString));
};

function CommentsTable({ comments, onReply, onDelete }) {
  if (!comments || comments.length === 0) {
    return <div className="text-center py-10 bg-white rounded-lg shadow">Không có bình luận nào trong hệ thống.</div>;
  }
  return (
    <div className="overflow-x-auto bg-white rounded-lg shadow">
      <table className="min-w-full leading-normal">
        <thead>
          <tr>
            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Người bình luận
            </th>
            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Nội dung
            </th>
            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Sản phẩm
            </th>
            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Ngày tạo
            </th>
            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Hành động
            </th>
          </tr>
        </thead>
        <tbody>
          {comments.map((comment) => {
            const isShopReply = !comment.customer;
            const isRootComment = !comment.parent_id;

            return (
              <tr key={comment.id} className={!isRootComment ? 'bg-gray-50' : 'bg-white'}>
                <td className="px-5 py-5 border-b border-gray-200 text-sm">
                  <div className="flex items-center">
                    {isShopReply ? <FaStore className="w-6 h-6 mr-3 text-indigo-500"/> : <FaUserCircle className="w-6 h-6 mr-3 text-gray-400"/>}
                    <p className="text-gray-900 whitespace-no-wrap font-semibold">
                      {isShopReply ? 'Shop' : comment.customer?.name || 'Khách hàng'}
                    </p>
                  </div>
                </td>
                <td className="px-5 py-5 border-b border-gray-200 text-sm">
                  <p className={`text-gray-900 whitespace-pre-wrap ${!isRootComment ? 'pl-4' : ''}`}>
                    {comment.content}
                  </p>
                  {!isRootComment && (
                    <p className="text-gray-600 text-xs mt-1 pl-4">Trả lời cho Cmt ID: {comment.parent_id}</p>
                  )}
                </td>
                <td className="px-5 py-5 border-b border-gray-200 text-sm">
                  <Link to={`/product/${comment.product.id}`} className="text-indigo-600 hover:text-indigo-900 hover:underline" target="_blank" rel="noopener noreferrer">
                    {comment.product?.name || `ID: ${comment.product_id}`}
                  </Link>
                </td>
                <td className="px-5 py-5 border-b border-gray-200 text-sm">
                  <p className="text-gray-900 whitespace-no-wrap">{formatDate(comment.createdAt)}</p>
                </td>
                <td className="px-5 py-5 border-b border-gray-200 text-sm text-center">
                  <div className="flex justify-center items-center space-x-3">
                    {isRootComment && !isShopReply && (
                        <button onClick={() => onReply(comment)} className="text-indigo-600 hover:text-indigo-900" title="Trả lời">
                            <FaReply size={16} />
                        </button>
                    )}
                    <button onClick={() => onDelete(comment.id)} className="text-red-600 hover:text-red-900" title="Xóa">
                      <FaTrashAlt size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default CommentsTable;