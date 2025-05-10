'use strict';

const express = require('express');
const productController = require('../controllers/product.controller'); 
const { authenticateToken, authorizeRole } = require('../middlewares/auth.middleware'); 

const router = express.Router();

router.post('/', authenticateToken, authorizeRole("admin"), productController.create);

router.get('/', productController.getAll);

router.get('/:id', productController.getById);

router.put('/:id', authenticateToken, authorizeRole("admin"), productController.update);

router.delete('/:id', authenticateToken, authorizeRole("admin"), productController.deleteProduct);

module.exports = router;