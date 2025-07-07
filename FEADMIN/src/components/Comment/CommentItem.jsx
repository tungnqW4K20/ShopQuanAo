// src/components/admin/CommentItem.jsx
import React, { useState } from 'react';
import ReplyForm from './ReplyForm';
import { FaUserCircle, FaStore } from 'react-icons/fa';
import { MdReply } from 'react-icons/md';

function CommentItem({ comment, onReplySubmit }) {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    try {
      const options = { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' };
      return new Intl.DateTimeFormat('vi-VN', options).format(new Date(dateString));
    } catch (e) {
      return 'Invalid Date';
    }
  };

  const handleReply = async (replyContent) => {
    setIsSubmitting(true);
    await onReplySubmit(comment.id, { content: replyContent });
    setIsSubmitting(false);
    setShowReplyForm(false); // Ẩn form sau khi trả lời thành công
  };

  const CommentBubble = ({ c, isReply = false }) => {
    // Nếu customer là null, đây là trả lời của admin (shop)
    const isAdminReply = !c.customer; 
    
    return (
        <div className={`flex items-start space-x-3 ${isReply ? 'mt-4' : ''}`}>
            <div className="flex-shrink-0">
                {isAdminReply ? (
                    <FaStore className="w-8 h-8 text-indigo-500" />
                ) : (
                    <FaUserCircle className="w-8 h-8 text-gray-400" />
                )}
            </div>
            <div className={`p-3 rounded-lg w-full ${isAdminReply ? 'bg-indigo-50' : 'bg-gray-100'}`}>
                <div className="flex items-center justify-between">
                    <p className="font-semibold text-sm text-gray-800">
                        {isAdminReply ? 'Shop' : c.customer?.name || 'Khách hàng'}
                    </p>
                    <time className="text-xs text-gray-500">{formatDate(c.createdAt)}</time>
                </div>
                <p className="text-sm text-gray-700 mt-1">{c.content}</p>
            </div>
        </div>
    );
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow mb-4">
      {/* Bình luận gốc của khách hàng */}
      <CommentBubble c={comment} />

      {/* Danh sách các trả lời */}
      <div className="ml-6 pl-5 border-l-2 border-gray-200">
        {comment.Replies && comment.Replies.map(reply => (
          <CommentBubble key={reply.id} c={reply} isReply={true} />
        ))}
      </div>

      {/* Nút và Form trả lời */}
      <div className="ml-11 mt-3">
        {!showReplyForm && (
          <button
            onClick={() => setShowReplyForm(true)}
            className="flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-800"
          >
            <MdReply className="mr-1" />
            Trả lời
          </button>
        )}
        {showReplyForm && (
          <div>
            <ReplyForm onSubmit={handleReply} isSubmitting={isSubmitting} />
            <button
              onClick={() => setShowReplyForm(false)}
              className="text-xs text-gray-500 hover:underline mt-2"
            >
              Hủy
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default CommentItem;