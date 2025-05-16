'use strict';

const orderService = require('../services/order.service'); // Adjust path if necessary

/**
 * Controller to create a new order.
 */
const create = async (req, res) => {
    try {
        const { customer_id, items } = req.body;

        // Basic validation at controller level
        if (!customer_id || typeof customer_id !== 'number') {
            return res.status(400).json({ success: false, message: 'Thiếu hoặc sai định dạng customer_id (phải là số).' });
        }
        if (!items || !Array.isArray(items) || items.length === 0) {
            return res.status(400).json({ success: false, message: 'Đơn hàng phải chứa ít nhất một sản phẩm (items array).' });
        }
        for (const item of items) {
            if (typeof item.product_id !== 'number' || 
                typeof item.color_product_id !== 'number' || 
                typeof item.size_product_id !== 'number' || 
                typeof item.quantity !== 'number' || 
                item.quantity <= 0) {
                return res.status(400).json({ 
                    success: false, 
                    message: 'Mỗi item trong đơn hàng phải có product_id, color_product_id, size_product_id (dạng số) và quantity (số > 0).' 
                });
            }
        }

        const newOrder = await orderService.createOrder({ customer_id, items });
        res.status(201).json({
            success: true,
            message: 'Tạo đơn hàng thành công!',
            data: newOrder
        });
    } catch (error) {
        console.error("Create Order Controller Error:", error.message);
        if (error.message.includes('bắt buộc') || error.message.includes('không hợp lệ') || error.message.includes('sai định dạng')) {
            return res.status(400).json({ success: false, message: error.message });
        }
        if (error.message.includes('không tìm thấy') || error.message.includes('không thuộc sản phẩm') || error.message.includes('không thể xác định giá')) {
            return res.status(404).json({ success: false, message: error.message });
        }
        // if (error.message.includes('không đủ số lượng tồn kho')) {
        //     return res.status(409).json({ success: false, message: error.message }); // 409 Conflict
        // }
        res.status(500).json({ success: false, message: 'Lỗi máy chủ nội bộ khi tạo đơn hàng.' });
    }
};

/**
 * Controller to get all orders.
 */
const getAll = async (req, res) => {
    try {
        const { limit, offset, status, customerId } = req.query;
        const queryOptions = {
            limit: limit ? parseInt(limit) : undefined,
            offset: offset ? parseInt(offset) : undefined,
            status,
            customerId: customerId ? parseInt(customerId) : undefined
        };
        const orders = await orderService.getAllOrders(queryOptions);
        res.status(200).json({
            success: true,
            data: orders
        });
    } catch (error) {
        console.error("Get All Orders Controller Error:", error.message);
        res.status(500).json({ success: false, message: 'Lỗi máy chủ nội bộ khi lấy danh sách đơn hàng.' });
    }
};

/**
 * Controller to get an order by ID.
 */
const getById = async (req, res) => {
    try {
        const orderId = req.params.id;
        if (isNaN(parseInt(orderId))) {
            return res.status(400).json({ success: false, message: 'ID đơn hàng không hợp lệ.' });
        }
        const order = await orderService.getOrderById(orderId);
        res.status(200).json({
            success: true,
            data: order
        });
    } catch (error) {
        console.error("Get Order By ID Controller Error:", error.message);
        if (error.message.includes('Không tìm thấy')) {
            return res.status(404).json({ success: false, message: error.message });
        }
        if (error.message.includes('không hợp lệ')) {
            return res.status(400).json({ success: false, message: error.message });
        }
        res.status(500).json({ success: false, message: 'Lỗi máy chủ nội bộ khi lấy thông tin đơn hàng.' });
    }
};

/**
 * Controller to update an order's status.
 */
const updateStatus = async (req, res) => {
    try {
        const orderId = req.params.id;
        const { status } = req.body;

        if (isNaN(parseInt(orderId))) {
            return res.status(400).json({ success: false, message: 'ID đơn hàng không hợp lệ.' });
        }
        if (!status || !['0', '1', '2'].includes(status)) {
            return res.status(400).json({ success: false, message: 'Trạng thái cập nhật không hợp lệ. Chỉ chấp nhận "0", "1", hoặc "2".' });
        }

        const updatedOrder = await orderService.updateOrderStatus(orderId, status);
        res.status(200).json({
            success: true,
            message: 'Cập nhật trạng thái đơn hàng thành công!',
            data: updatedOrder
        });
    } catch (error) {
        console.error("Update Order Status Controller Error:", error.message);
        if (error.message.includes('Không tìm thấy')) {
            return res.status(404).json({ success: false, message: error.message });
        }
        if (error.message.includes('không hợp lệ')) {
            return res.status(400).json({ success: false, message: error.message });
        }
        res.status(500).json({ success: false, message: 'Lỗi máy chủ nội bộ khi cập nhật trạng thái đơn hàng.' });
    }
};

/**
 * Controller to delete an order (soft delete).
 */
const deleteOrderController = async (req, res) => {
    try {
        const orderId = req.params.id;
        if (isNaN(parseInt(orderId))) {
            return res.status(400).json({ success: false, message: 'ID đơn hàng không hợp lệ.' });
        }

        await orderService.deleteOrder(orderId);
        res.status(200).json({
            success: true,
            message: 'Xóa đơn hàng thành công!'
        });
    } catch (error) {
        console.error("Delete Order Controller Error:", error.message);
        if (error.message.includes('Không tìm thấy')) {
            return res.status(404).json({ success: false, message: error.message });
        }
         if (error.message.includes('không hợp lệ')) {
            return res.status(400).json({ success: false, message: error.message });
        }
        res.status(500).json({ success: false, message: 'Lỗi máy chủ nội bộ khi xóa đơn hàng.' });
    }
};

module.exports = {
    create,
    getAll,
    getById,
    updateStatus,
    deleteOrder: deleteOrderController // Renamed to avoid keyword clash
};