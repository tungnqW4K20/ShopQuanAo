// src/components/admin/CommentList.jsx
import React from 'react';
import CommentItem from './CommentItem';

function CommentList({ comments, onReplySubmit }) {
  if (!comments || comments.length === 0) {
    return (
      <div className="text-center py-10 bg-white rounded-lg shadow">
        <p className="text-gray-500">Chưa có bình luận nào cho sản phẩm này.</p>
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
        />
      ))}
    </div>
  );
}

export default CommentList;