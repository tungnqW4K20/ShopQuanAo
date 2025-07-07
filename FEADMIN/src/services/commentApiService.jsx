// src/services/commentApiService.js
import request from './apiService'; // Tái sử dụng apiService đã có

const API_ENDPOINT = '/comments';

/**
 * Lấy tất cả bình luận (và các trả lời) cho một sản phẩm cụ thể.
 * @param {string|number} productId - ID của sản phẩm.
 * @returns {Promise<Array>} - Mảng các đối tượng bình luận.
 */
const getCommentsByProductId = async (productId) => {
  const response = await request({
    method: 'get',
    url: `${API_ENDPOINT}/product/${productId}`,
  });
  
  if (response && response.success) {
    return response.data;
  } else {
    throw new Error(response?.message || `Không thể lấy bình luận cho sản phẩm ID ${productId}.`);
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
  getCommentsByProductId,
  replyToComment,
};

export default commentApiService;