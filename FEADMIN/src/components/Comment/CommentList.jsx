// src/components/Comment/CommentList.jsx
import React from 'react';
import CommentItem from './CommentItem';

// Thêm onDelete vào props
function CommentList({ comments, onReplySubmit, onDelete }) {
  if (!comments || comments.length === 0) {
    return (
      <div className="text-center py-10 bg-white rounded-lg shadow">
        <p className="text-gray-500">Chưa có bình luận nào.</p>
      </div>
    );
  }

  return (
    <div>
      {comments.map((comment) => (
        <CommentItem
          key={comment.id}
          comment={comment}
          onReplySubmit={onReplySubmit}
          onDelete={onDelete} 
        />
      ))}
    </div>
  );
}

export default CommentList;