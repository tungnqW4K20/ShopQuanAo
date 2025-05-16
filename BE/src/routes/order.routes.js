'use strict';

const express = require('express');
const orderController = require('../controllers/order.controller'); // Adjust path
const { authenticateToken, authorizeRole } = require('../middlewares/auth.middleware'); // Adjust path

const router = express.Router();

// Create a new order - Accessible by authenticated users (e.g., customers)
router.post('/', authenticateToken, orderController.create);

// Get all orders - Admin might see all, users might see their own (logic can be in service/controller)
router.get('/', authenticateToken, authorizeRole(["admin", "staff"]), orderController.getAll); // Staff can also view all orders

// Get a specific order by ID - User can see their own, admin can see any
// More complex authorization logic would be needed here if users can only see their own orders
// For now, let's assume admin/staff can see any order, and customers might have a different route like /my-orders/:id
router.get('/:id', authenticateToken, authorizeRole(["admin", "staff"]), orderController.getById);

// Update order status - Typically by admin or staff
router.put('/:id/status', authenticateToken, authorizeRole(["admin", "staff"]), orderController.updateStatus);

// Delete an order (soft delete) - Typically by admin
router.delete('/:id', authenticateToken, authorizeRole("admin"), orderController.deleteOrder);

module.exports = router;