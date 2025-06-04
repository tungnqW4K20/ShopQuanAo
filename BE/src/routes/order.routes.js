

const express = require('express');
const orderController = require('../controllers/order.controller');
const { authenticateToken, authorizeRole } = require('../middlewares/auth.middleware'); 

const router = express.Router();

router.post('/', authenticateToken, orderController.create);
router.get('/', authenticateToken, orderController.getMyOrders);
router.get('/:id', authenticateToken, orderController.getMyOrderById);
router.get('/admin/all', authenticateToken, authorizeRole("admin"), orderController.getAllOrdersAdmin);



module.exports = router;