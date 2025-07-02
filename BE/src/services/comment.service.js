'use strict';

const db = require('../models');
const { Comment, Customer, Product } = db;

/**
 * Lấy tất cả bình luận (và các câu trả lời) cho một sản phẩm.
 * Các bình luận được sắp xếp theo cấu trúc cây (cha-con).
 * @param {number} productId - ID của sản phẩm.
 * @returns {Promise<Comment[]>} - Danh sách các bình luận gốc, mỗi bình luận chứa các câu trả lời (replies).
 */
const getCommentsByProduct = async (productId) => {
    // Đầu tiên, kiểm tra xem sản phẩm có tồn tại không
    const productExists = await Product.findByPk(productId);
    if (!productExists) {
        throw new Error(`Không tìm thấy sản phẩm với ID ${productId}.`);
    }

    // Lấy tất cả các bình luận cấp cao nhất (không có parent_id)
    const comments = await Comment.findAll({
        where: {
            product_id: productId,
            parent_id: null // Chỉ lấy các bình luận gốc
        },
        include: [
            {
                model: Customer,
                as: 'customer', // Lấy thông tin người bình luận (khách hàng)
                attributes: ['id', 'name'] // Chỉ lấy các trường cần thiết
            },
            {
                model: Comment,
                as: 'Replies', // Lấy các câu trả lời cho bình luận này
                include: [
                    {
                        // Lấy thông tin người trả lời (có thể là khách hàng khác hoặc admin)
                        // Nếu là admin trả lời, customer sẽ là null
                        model: Customer,
                        as: 'customer',
                        attributes: ['id', 'name']
                    }
                ]
            }
        ],
        order: [['createdAt', 'DESC']] // Sắp xếp bình luận mới nhất lên đầu
    });

    return comments;
};

/**
 * Tạo một bình luận mới (do khách hàng thực hiện).
 * @param {object} commentData - Dữ liệu bình luận { content, product_id }.
 * @param {number} customerId - ID của khách hàng đang đăng nhập.
 * @returns {Promise<Comment>} - Bình luận vừa được tạo.
 * @throws {Error}
 */
const createCustomerComment = async (commentData, customerId) => {
    const { content, product_id } = commentData;
    if (!content || !product_id) {
        throw new Error('Nội dung và ID sản phẩm là bắt buộc.');
    }

    // Kiểm tra sản phẩm và khách hàng có tồn tại không
    const product = await Product.findByPk(product_id);
    if (!product) {
        throw new Error(`Không tìm thấy sản phẩm với ID ${product_id}.`);
    }
    const customer = await Customer.findByPk(customerId);
    if (!customer) {
        throw new Error(`Không tìm thấy khách hàng với ID ${customerId}.`);
    }

    const newComment = await Comment.create({
        content,
        product_id,
        customer_id: customerId,
        parent_id: null // Đây là bình luận gốc
    });

    return newComment;
};

/**
 * Tạo một câu trả lời cho bình luận (do admin thực hiện).
 * @param {number} parentId - ID của bình luận cha đang được trả lời.
 * @param {object} replyData - Dữ liệu câu trả lời { content }.
 * @param {number} adminId - ID của admin đang đăng nhập (dùng để ghi log nếu cần, ở đây không lưu vào DB).
 * @returns {Promise<Comment>} - Câu trả lời vừa được tạo.
 * @throws {Error}
 */
const createAdminReply = async (parentId, replyData) => {
    const { content } = replyData;
    if (!content) {
        throw new Error('Nội dung trả lời là bắt buộc.');
    }

    const parentComment = await Comment.findByPk(parentId);
    if (!parentComment) {
        throw new Error(`Không tìm thấy bình luận gốc với ID ${parentId}.`);
    }

    // Admin trả lời, vì vậy customer_id sẽ là null.
    // Câu trả lời phải thuộc cùng một sản phẩm với bình luận gốc.
    const newReply = await Comment.create({
        content,
        product_id: parentComment.product_id,
        parent_id: parentId,
        customer_id: null // Admin không phải là customer
    });

    return newReply;
};


/**
 * Cập nhật nội dung một bình luận.
 * Chỉ chủ sở hữu bình luận mới có quyền cập nhật.
 * @param {number} commentId - ID của bình luận cần cập nhật.
 * @param {object} updateData - Dữ liệu cập nhật { content }.
 * @param {number} userId - ID của người dùng yêu cầu (khách hàng).
 * @returns {Promise<Comment>} - Bình luận sau khi cập nhật.
 * @throws {Error}
 */
const updateComment = async (commentId, updateData, userId) => {
    const { content } = updateData;
    if (!content) {
        throw new Error('Nội dung là bắt buộc để cập nhật.');
    }

    const comment = await Comment.findByPk(commentId);
    if (!comment) {
        throw new Error(`Không tìm thấy bình luận với ID ${commentId}.`);
    }

    // Kiểm tra quyền: Chỉ chủ sở hữu mới được sửa
    if (comment.customer_id !== userId) {
        throw new Error('Bạn không có quyền chỉnh sửa bình luận này.');
    }

    await comment.update({ content });
    return comment;
};

/**
 * Xóa một bình luận.
 * Chủ sở hữu hoặc Admin có quyền xóa.
 * Khi xóa bình luận cha, các câu trả lời cũng sẽ bị xóa (do 'onDelete: CASCADE' trong model).
 * @param {number} commentId - ID của bình luận cần xóa.
 * @param {object} user - Thông tin người dùng { id, role: 'customer' | 'admin' }.
 * @returns {Promise<void>}
 * @throws {Error}
 */
const deleteComment = async (commentId, user) => {
    const comment = await Comment.findByPk(commentId);
    if (!comment) {
        throw new Error(`Không tìm thấy bình luận với ID ${commentId} để xóa.`);
    }

    // Kiểm tra quyền: Hoặc là admin, hoặc là chủ sở hữu bình luận
    const isOwner = comment.customer_id === user.id;
    const isAdmin = user.role === 'admin';

    if (!isOwner && !isAdmin) {
        throw new Error('Bạn không có quyền xóa bình luận này.');
    }

    await comment.destroy(); // destroy() sẽ kích hoạt onDelete: CASCADE
};

module.exports = {
    getCommentsByProduct,
    createCustomerComment,
    createAdminReply,
    updateComment,
    deleteComment,
};