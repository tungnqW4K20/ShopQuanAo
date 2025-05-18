// routes/upload.routes.js
'use strict';

const express = require('express');
const uploadController = require('../controllers/upload.controller');
const { authenticateToken, authorizeRole } = require('../middlewares/auth.middleware');
const uploadMiddleware = require('../middlewares/upload.middleware'); // Import multer middleware
const multer = require('multer');

const router = express.Router();


router.post(
    '/product-image',
    authenticateToken,
    authorizeRole("admin"),
    uploadMiddleware.single('productImage'), 
    uploadController.uploadProductImage
);


router.use((err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(413).json({ success: false, message: 'Kích thước tệp quá lớn. Tối đa 5MB.' });
        }
        return res.status(400).json({ success: false, message: err.message });
    } else if (err) {
        return res.status(400).json({ success: false, message: err.message });
    }
    next();
});


module.exports = router;