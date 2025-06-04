

const express = require('express');
const orderController = require('../controllers/order.controller');
const { authenticateToken, authorizeRole } = require('../middlewares/auth.middleware'); 

const router = express.Router();

router.post('/', authenticateToken, orderController.create);
router.get('/', authenticateToken, orderController.getMyOrders);
router.get('/:id', authenticateToken, orderController.getMyOrderById);
router.get('/admin/all', authenticateToken, authorizeRole("admin"), orderController.getAllOrdersAdmin);


router.patch('/admin/orders/:id/status',
    authenticateToken,
    authorizeRole("admin"),
    orderController.updateOrderStatusAdmin
);

// API để Admin lấy danh sách các trạng thái đơn hàng khả dụng
router.get('/admin/statuses',
    authenticateToken,
    authorizeRole("admin"),
    orderController.getOrderStatusesAdmin
);

module.exports = router;