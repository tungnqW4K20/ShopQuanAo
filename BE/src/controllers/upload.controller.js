// controllers/upload.controller.js
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
        console.error("Upload Product Image Error:", error.message, error.stack); // Log stack trace
        // Lỗi từ fileFilter của multer sẽ được next() và đi vào error handler của Express route
        // Trừ khi bạn muốn xử lý nó cụ thể ở đây trước
        // if (error.message.includes('Chỉ cho phép tải lên tệp hình ảnh!')) {
        //     return res.status(400).json({ success: false, message: error.message });
        // }
        // Lỗi LIMIT_FILE_SIZE cũng sẽ được next() vào error handler của Express route
        // if (error.message.includes('Kích thước tệp quá lớn')) {
        //      return res.status(413).json({ success: false, message: 'Kích thước tệp quá lớn. Tối đa 5MB.' });
        // }
        // next(error); // Chuyển lỗi cho middleware xử lý lỗi chung
        // Hoặc nếu muốn trả về lỗi 500 cụ thể từ đây
        res.status(500).json({ success: false, message: 'Lỗi máy chủ nội bộ khi tải ảnh lên.' });
    }
};

const uploadMultipleProductImages = async (req, res, next) => {
    try {
        // req.files sẽ là một mảng các đối tượng file khi dùng upload.array()
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Không có tệp nào được tải lên hoặc các tệp không hợp lệ.'
            });
        }

        const imageUrls = await uploadService.handleMultipleProductImagesUpload(req.files, req);

        res.status(201).json({
            success: true,
            message: 'Tải nhiều ảnh sản phẩm thành công!',
            data: {
                imageUrls: imageUrls
            }
        });
    } catch (error) {
        console.error("Upload Multiple Product Images Error:", error.message, error.stack); // Log stack trace
        // Tương tự như trên, các lỗi từ multer (file type, file size) nên được xử lý bởi error handler của route
        // next(error);
        res.status(500).json({ success: false, message: 'Lỗi máy chủ nội bộ khi tải nhiều ảnh lên.' });
    }
};

module.exports = {
    uploadProductImage,
    uploadMultipleProductImages // Export controller mới
};