'use strict';

const categoryService = require('../services/category.service');

/**
 * Controller để tạo category mới.
 */
const create = async (req, res, next) => {
    try {
        const { name } = req.body;

        if (!name) {
            return res.status(400).json({
                success: false,
                message: 'Thiếu trường bắt buộc: name'
            });
        }

        const newCategory = await categoryService.createCategory({ name });

        res.status(201).json({
            success: true,
            message: 'Tạo category thành công!',
            data: newCategory
        });
    } catch (error) {
        console.error("Create Category Error:", error.message);
        if (error.message.includes('đã tồn tại')) {
            return res.status(409).json({ success: false, message: error.message }); // 409 Conflict
        }
        if (error.message.includes('bắt buộc')) {
             return res.status(400).json({ success: false, message: error.message }); // 400 Bad Request
        }
        res.status(500).json({ success: false, message: 'Lỗi máy chủ nội bộ khi tạo category.' });
        // next(error); // Hoặc dùng middleware xử lý lỗi chung
    }
};

/**
 * Controller để lấy tất cả category.
 */
const getAll = async (req, res, next) => {
    try {
        const categories = await categoryService.getAllCategories();
        res.status(200).json({
            success: true,
            data: categories
        });
    } catch (error) {
        console.error("Get All Categories Error:", error.message);
        res.status(500).json({ success: false, message: 'Lỗi máy chủ nội bộ khi lấy danh sách category.' });
        // next(error);
    }
};

/**
 * Controller để lấy một category theo ID.
 */
const getById = async (req, res, next) => {
    try {
        const categoryId = req.params.id;
         // Đơn giản kiểm tra xem id có phải là số không (tùy chọn)
         if (isNaN(parseInt(categoryId))) {
            return res.status(400).json({ success: false, message: 'ID category không hợp lệ.' });
        }

        const category = await categoryService.getCategoryById(categoryId);
        res.status(200).json({
            success: true,
            data: category
        });
    } catch (error) {
        console.error("Get Category By ID Error:", error.message);
        if (error.message.includes('Không tìm thấy')) {
            return res.status(404).json({ success: false, message: error.message }); // 404 Not Found
        }
        res.status(500).json({ success: false, message: 'Lỗi máy chủ nội bộ khi lấy thông tin category.' });
        // next(error);
    }
};

/**
 * Controller để cập nhật category theo ID.
 */
const update = async (req, res, next) => {
    try {
        const categoryId = req.params.id;
        const { name } = req.body;

        // Đơn giản kiểm tra xem id có phải là số không (tùy chọn)
         if (isNaN(parseInt(categoryId))) {
            return res.status(400).json({ success: false, message: 'ID category không hợp lệ.' });
        }

        if (!name) {
            return res.status(400).json({
                success: false,
                message: 'Thiếu trường bắt buộc để cập nhật: name'
            });
        }

        const updatedCategory = await categoryService.updateCategory(categoryId, { name });

        res.status(200).json({
            success: true,
            message: 'Cập nhật category thành công!',
            data: updatedCategory
        });
    } catch (error) {
        console.error("Update Category Error:", error.message);
        if (error.message.includes('Không tìm thấy')) {
            return res.status(404).json({ success: false, message: error.message }); // 404 Not Found
        }
        if (error.message.includes('đã tồn tại')) {
            return res.status(409).json({ success: false, message: error.message }); // 409 Conflict
        }
        if (error.message.includes('bắt buộc')) {
             return res.status(400).json({ success: false, message: error.message }); // 400 Bad Request
        }
        res.status(500).json({ success: false, message: 'Lỗi máy chủ nội bộ khi cập nhật category.' });
        // next(error);
    }
};

/**
 * Controller để xóa category theo ID (soft delete).
 */
const deleteCategory = async (req, res, next) => {
    try {
        const categoryId = req.params.id;

        // Đơn giản kiểm tra xem id có phải là số không (tùy chọn)
         if (isNaN(parseInt(categoryId))) {
            return res.status(400).json({ success: false, message: 'ID category không hợp lệ.' });
        }

        await categoryService.deleteCategory(categoryId);

        res.status(200).json({ // Hoặc 204 No Content nếu không muốn trả về body
            success: true,
            message: 'Xóa category thành công!'
        });
    } catch (error) {
        console.error("Delete Category Error:", error.message);
        if (error.message.includes('Không tìm thấy')) {
            return res.status(404).json({ success: false, message: error.message }); // 404 Not Found
        }
        res.status(500).json({ success: false, message: 'Lỗi máy chủ nội bộ khi xóa category.' });
        // next(error);
    }
};


module.exports = {
    create,
    getAll,
    getById,
    update,
    deleteCategory // Đổi tên hàm để tránh trùng với từ khóa delete
};