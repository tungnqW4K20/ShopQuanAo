// routes/upload.routes.js
'use strict';

const express = require('express');
const uploadController = require('../controllers/upload.controller');
const { authenticateToken, authorizeRole } = require('../middlewares/auth.middleware');
const uploadMiddleware = require('../middlewares/upload.middleware'); // Instance multer đã cấu hình
const multer = require('multer'); // Để check instanceof MulterError

const router = express.Router();

// Route cho upload một ảnh sản phẩm
router.post(
    '/product-image',
    authenticateToken,
    authorizeRole("admin"),
    uploadMiddleware.single('productImage'), // Sử dụng .single() cho một file
    uploadController.uploadProductImage
);

// Route mới cho upload nhiều ảnh sản phẩm
// 'productImages' là tên field trong form-data
// 10 là số lượng file tối đa cho phép tải lên cùng lúc
router.post(
    '/product-multi-images', // Endpoint mới
    authenticateToken,
    authorizeRole("admin"),
    uploadMiddleware.array('productImages', 10), // Sử dụng .array() cho nhiều files
    uploadController.uploadMultipleProductImages
);

// Middleware xử lý lỗi chung cho các route upload (bao gồm lỗi từ Multer)
// Middleware này nên đặt SAU các định nghĩa route của bạn
router.use((err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        console.error("MulterError in route:", err);
        if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(413).json({ success: false, message: 'Kích thước một hoặc nhiều tệp quá lớn. Tối đa 5MB mỗi tệp.' });
        }
        // Các lỗi Multer khác (LIMIT_FILE_COUNT, LIMIT_FIELD_KEY, etc.)
        return res.status(400).json({ success: false, message: `Lỗi tải lên: ${err.message}` });
    } else if (err) {
        // Lỗi từ fileFilter (ví dụ: 'Chỉ cho phép tải lên tệp hình ảnh!')
        console.error("Non-MulterError in route but caught by handler:", err);
        if (err.message && err.message.includes('Chỉ cho phép tải lên tệp hình ảnh!')) {
            return res.status(400).json({ success: false, message: err.message });
        }
        // Các lỗi khác không xác định
        return res.status(500).json({ success: false, message: err.message || 'Đã có lỗi xảy ra.' });
    }
    // Nếu không có lỗi, hoặc lỗi đã được xử lý và muốn tiếp tục (ít khi xảy ra với error handler)
    next();
});


module.exports = router;