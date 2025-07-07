// src/pages/admin/ManageProductComments.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import commentApiService from '../services/commentApiService';
import { useAuth } from '../contexts/AuthContext';
import CommentList from '../components/Comment/CommentList'; // Điều chỉnh đường dẫn nếu cần

function ManageProductComments() {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { handleUnauthorized } = useAuth();

  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // Có thể thêm state để lấy tên sản phẩm nếu cần
  // const [productName, setProductName] = useState(''); 

  const fetchComments = useCallback(async () => {
    if (!productId) return;
    setLoading(true);
    setError(null);
    try {
      const data = await commentApiService.getCommentsByProductId(productId);
      setComments(data);
    } catch (err) {
      console.error("Fetch comments error:", err);
      setError(err.message || 'Không thể tải danh sách bình luận.');
      toast.error(err.message || 'Không thể tải danh sách bình luận.');
      if (err.shouldLogout || err.status === 401) {
        handleUnauthorized();
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  }, [productId, handleUnauthorized, navigate]);

  useEffect(() => {
    // Optional: fetch product details to display its name
    // productApiService.getProductById(productId).then(p => setProductName(p.name));
    fetchComments();
  }, [fetchComments]);

  const handleReplySubmit = async (parentCommentId, replyData) => {
    try {
      await commentApiService.replyToComment(parentCommentId, replyData);
      toast.success('Đã trả lời bình luận thành công!');
      // Tải lại danh sách bình luận để cập nhật UI
      await fetchComments();
    } catch (err) {
      console.error("Reply to comment error:", err);
      toast.error(err.message || 'Trả lời bình luận thất bại.');
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
          Quản lý Bình luận
        </h1>
        <p className="text-gray-600">Sản phẩm ID: <span className="font-mono bg-gray-200 px-2 py-1 rounded">{productId}</span></p>
        {/* {productName && <p className="text-gray-600">Tên sản phẩm: <strong>{productName}</strong></p>} */}
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
            />
        </div>
      )}
    </div>
  );
}

export default ManageProductComments;