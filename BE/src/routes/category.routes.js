'use strict';

const express = require('express');
const categoryController = require('../controllers/category.controller');
// Có thể thêm middleware xác thực/ủy quyền ở đây nếu cần
// const authMiddleware = require('../middlewares/auth.middleware');

const router = express.Router();

// Định nghĩa các route cho Category CRUD

// POST /api/categories - Tạo category mới
router.post('/', /* authMiddleware.isAdmin, */ categoryController.create); // Ví dụ thêm middleware

// GET /api/categories - Lấy tất cả category
router.get('/', categoryController.getAll);

// GET /api/categories/:id - Lấy category theo ID
router.get('/:id', categoryController.getById);

// PUT /api/categories/:id - Cập nhật category theo ID
router.put('/:id', /* authMiddleware.isAdmin, */ categoryController.update);

// DELETE /api/categories/:id - Xóa category theo ID (soft delete)
router.delete('/:id', /* authMiddleware.isAdmin, */ categoryController.deleteCategory);


module.exports = router;