

const express = require('express');
const orderController = require('../controllers/order.controller');
const { authenticateToken } = require('../middlewares/auth.middleware'); 

const router = express.Router();

router.post('/', authenticateToken, orderController.create);
router.get('/', authenticateToken, orderController.getMyOrders);
router.get('/:id', authenticateToken, orderController.getMyOrderById);

module.exports = router;