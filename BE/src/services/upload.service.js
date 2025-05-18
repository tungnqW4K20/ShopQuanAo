'use strict';

const path = require('path');

const handleProductImageUpload = async (file, req) => {
    if (!file) {
        throw new Error('Không có thông tin tệp để xử lý.');
    }

    const baseUrl = `${req.protocol}://${req.get('host')}`;
    const imageUrl = `${baseUrl}/uploads/products/${file.filename}`;
    
    return imageUrl;
};

module.exports = {
    handleProductImageUpload
};
