'use strict';

const uploadService = require('../services/upload.service');

const uploadProductImage = async (req, res, next) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'Không có tệp nào được tải lên hoặc tệp không hợp lệ.'
            });
        }

        const imageUrl = await uploadService.handleProductImageUpload(req.file, req);

        res.status(201).json({
            success: true,
            message: 'Tải ảnh sản phẩm thành công!',
            data: {
                imageUrl: imageUrl
            }
        });
    } catch (error) {
        console.error("Upload Product Image Error:", error.message);
        if (error.message.includes('Chỉ cho phép tải lên tệp hình ảnh!')) {
            return res.status(400).json({ success: false, message: error.message });
        }
        if (error.message.includes('Kích thước tệp quá lớn')) { // You might need to catch this from multer's error handling
             return res.status(413).json({ success: false, message: 'Kích thước tệp quá lớn. Tối đa 5MB.' });
        }
        res.status(500).json({ success: false, message: 'Lỗi máy chủ nội bộ khi tải ảnh lên.' });
    }
};

module.exports = {
    uploadProductImage
};