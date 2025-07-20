// src/services/commentApiService.js
import request from './apiService'; // Tái sử dụng apiService đã cấu hình

const API_ENDPOINT = '/comments';

/**
 * Xử lý danh sách bình luận phẳng từ API thành cấu trúc cây (lồng nhau).
 * @param {Array} commentsList - Danh sách bình luận phẳng.
 * @returns {Array} - Mảng các bình luận gốc, mỗi bình luận chứa mảng 'Replies' của nó.
 */
const nestComments = (commentsList) => {
  if (!commentsList || !Array.isArray(commentsList)) {
    return [];
  }

  const commentMap = {};
  const rootComments = [];

  commentsList.forEach(comment => {
    comment.Replies = [];
    commentMap[comment.id] = comment;
  });

  commentsList.forEach(comment => {
    if (comment.parent_id !== null) {
      const parent = commentMap[comment.parent_id];
      if (parent) {
        parent.Replies.push(comment);
      }
    } else {
      rootComments.push(comment);
    }
  });
  
  const sortByDate = (a, b) => new Date(b.createdAt) - new Date(a.createdAt);
  
  rootComments.sort(sortByDate);
  rootComments.forEach(comment => {
    if (comment.Replies.length > 0) {
      comment.Replies.sort(sortByDate);
    }
  });

  return rootComments;
};

/**
 * [ADMIN] Lấy TẤT CẢ bình luận trong hệ thống và cấu trúc lại chúng.
 * @returns {Promise<Array>} - Mảng các bình luận gốc đã được lồng nhau.
 */
const getAllComments = async () => {
    const response = await request({
        method: 'get',
        url: `${API_ENDPOINT}/all`,
    });

    if (response && response.success) {
        return nestComments(response.data); // Xử lý dữ liệu tại đây
    } else {
        throw new Error(response?.message || 'Không thể tải danh sách bình luận.');
    }
};

/**
 * Lấy tất cả bình luận cho một sản phẩm cụ thể và cấu trúc lại chúng.
 * @param {string|number} productId - ID của sản phẩm.
 * @returns {Promise<Array>} - Mảng các bình luận gốc đã được lồng nhau.
 */
const getCommentsByProductId = async (productId) => {
  const response = await request({
    method: 'get',
    url: `${API_ENDPOINT}/product/${productId}`,
  });
  
  if (response && response.success) {
    return nestComments(response.data); // Xử lý dữ liệu tại đây
  } else {
    throw new Error(response?.message || `Không thể lấy bình luận cho sản phẩm ID ${productId}.`);
  }
};


/**
 * Xóa một bình luận hoặc trả lời theo ID.
 * @param {string|number} commentId - ID của bình luận cần xóa.
 * @returns {Promise<object>} - Phản hồi từ máy chủ.
 */
const deleteCommentById = async (commentId) => {
    const response = await request({
        method: 'delete',
        url: `${API_ENDPOINT}/${commentId}`,
    });

    if (response && response.success) {
        return response;
    } else {
        throw new Error(response?.message || 'Xóa bình luận thất bại.');
    }
};

/**
 * Admin trả lời một bình luận của khách hàng.
 * @param {string|number} parentCommentId - ID của bình luận gốc cần trả lời.
 * @param {object} replyData - Dữ liệu trả lời, ví dụ: { content: "..." }.
 * @returns {Promise<object>} - Đối tượng bình luận trả lời vừa được tạo.
 */
const replyToComment = async (parentCommentId, replyData) => {
  const response = await request({
    method: 'post',
    url: `${API_ENDPOINT}/${parentCommentId}/reply`,
    data: replyData,
  });

  if (response && response.success) {
    return response.data;
  } else {
    throw new Error(response?.message || 'Trả lời bình luận thất bại.');
  }
};

const commentApiService = {
  getAllComments,
  getCommentsByProductId,
  deleteCommentById,
  replyToComment,
};

export default commentApiService;