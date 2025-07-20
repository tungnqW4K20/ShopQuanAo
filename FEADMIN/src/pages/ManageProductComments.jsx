// src/pages/admin/AllCommentsManagement.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import commentApiService from '../services/commentApiService';
import { useAuth } from '../contexts/AuthContext';
import CommentList from '../components/Comment/CommentList'; // Điều chỉnh đường dẫn nếu cần

function ManageProductComments() {
  const navigate = useNavigate();
  const { handleUnauthorized } = useAuth();

  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAllComments = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Gọi hàm mới để lấy TẤT CẢ bình luận
      const data = await commentApiService.getAllComments();
      setComments(data);
    } catch (err) {
      console.error("Fetch all comments error:", err);
      const errorMessage = err.message || 'Không thể tải danh sách bình luận.';
      setError(errorMessage);
      toast.error(errorMessage);
      if (err.shouldLogout || err.status === 401) {
        handleUnauthorized();
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  }, [handleUnauthorized, navigate]);

  useEffect(() => {
    fetchAllComments();
  }, [fetchAllComments]);

  const handleReplySubmit = async (parentCommentId, replyData) => {
    try {
      await commentApiService.replyToComment(parentCommentId, replyData);
      toast.success('Đã trả lời bình luận thành công!');
      // Tải lại danh sách để cập nhật UI
      await fetchAllComments();
    } catch (err) {
      console.error("Reply to comment error:", err);
      toast.error(err.message || 'Trả lời bình luận thất bại.');
       if (err.shouldLogout || err.status === 401) {
        handleUnauthorized();
        navigate('/login');
      }
    }
  };

  const handleDelete = async (commentId) => {
    try {
        await commentApiService.deleteCommentById(commentId);
        toast.success('Đã xóa bình luận thành công!');
        // Tải lại danh sách để cập nhật UI
        await fetchAllComments();
    } catch (err) {
        console.error("Delete comment error:", err);
        toast.error(err.message || 'Xóa bình luận thất bại.');
        if (err.shouldLogout || err.status === 401) {
            handleUnauthorized();
            navigate('/login');
        }
    }
  };

  return (
    <div className="container mx-auto px-4 sm:px-8 py-8">
      <ToastContainer autoClose={3000} hideProgressBar />
      
      <div className="mb-6">
        <h1 className="text-2xl font-semibold leading-tight text-gray-800">
          Quản lý Tất cả Bình luận
        </h1>
        <p className="text-gray-600">Xem, trả lời và xóa các bình luận từ tất cả sản phẩm.</p>
      </div>

      {loading && <p className="text-center text-gray-500 py-4">Đang tải bình luận...</p>}
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <strong className="font-bold">Lỗi! </strong>
            <span className="block sm:inline">{error}</span>
        </div>
      )}

      {!loading && !error && (
        <div className="max-w-4xl mx-auto">
            <CommentList 
                comments={comments} 
                onReplySubmit={handleReplySubmit}
                onDelete={handleDelete}
            />
        </div>
      )}
    </div>
  );
}

export default ManageProductComments;