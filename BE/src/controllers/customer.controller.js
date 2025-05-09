'use strict';

const customerService = require('../services/customer.service'); // Adjust path if necessary

/**
 * Controller to create a new customer (Registration).
 */
const create = async (req, res) => {
    try {
        const { name, email, address, username, password } = req.body;

        if (!name || !email || !address) {
            return res.status(400).json({
                success: false,
                message: 'Tên, email và địa chỉ là các trường bắt buộc.'
            });
        }
        // Password can be optional if username is also optional or for other auth methods
        // if (!password) {
        //     return res.status(400).json({
        //         success: false,
        //         message: 'Mật khẩu là trường bắt buộc.'
        //     });
        // }


        const newCustomer = await customerService.createCustomer({ name, email, address, username, password });

        res.status(201).json({
            success: true,
            message: 'Đăng ký khách hàng thành công!',
            data: newCustomer
        });
    } catch (error) {
        console.error("Create Customer Error:", error.message);
        if (error.message.includes('đã tồn tại') || error.message.includes('đã được sử dụng')) {
            return res.status(409).json({ success: false, message: error.message }); // 409 Conflict
        }
        if (error.message.includes('bắt buộc') || error.name === 'SequelizeValidationError') {
             return res.status(400).json({ success: false, message: error.message }); // 400 Bad Request
        }
        res.status(500).json({ success: false, message: 'Lỗi máy chủ nội bộ khi tạo khách hàng.' });
    }
};

/**
 * Controller to get all customers.
 */
const getAll = async (req, res) => {
    try {
        const customers = await customerService.getAllCustomers();
        res.status(200).json({
            success: true,
            data: customers
        });
    } catch (error) {
        console.error("Get All Customers Error:", error.message);
        res.status(500).json({ success: false, message: 'Lỗi máy chủ nội bộ khi lấy danh sách khách hàng.' });
    }
};

/**
 * Controller to get a customer by ID.
 */
const getById = async (req, res) => {
    try {
        const customerId = req.params.id;
        if (isNaN(parseInt(customerId))) {
            return res.status(400).json({ success: false, message: 'ID khách hàng không hợp lệ.' });
        }

        const customer = await customerService.getCustomerById(customerId);
        res.status(200).json({
            success: true,
            data: customer
        });
    } catch (error) {
        console.error("Get Customer By ID Error:", error.message);
        if (error.message.includes('Không tìm thấy')) {
            return res.status(404).json({ success: false, message: error.message }); // 404 Not Found
        }
        res.status(500).json({ success: false, message: 'Lỗi máy chủ nội bộ khi lấy thông tin khách hàng.' });
    }
};

/**
 * Controller to update a customer by ID.
 */
const update = async (req, res) => {
    try {
        const customerId = req.params.id;
        const updateData = req.body; // { name, email, address, username, password }

        if (isNaN(parseInt(customerId))) {
            return res.status(400).json({ success: false, message: 'ID khách hàng không hợp lệ.' });
        }

        if (Object.keys(updateData).length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Không có dữ liệu để cập nhật.'
            });
        }

        const updatedCustomer = await customerService.updateCustomer(customerId, updateData);

        res.status(200).json({
            success: true,
            message: 'Cập nhật thông tin khách hàng thành công!',
            data: updatedCustomer
        });
    } catch (error) {
        console.error("Update Customer Error:", error.message);
        if (error.message.includes('Không tìm thấy')) {
            return res.status(404).json({ success: false, message: error.message });
        }
        if (error.message.includes('đã được sử dụng') || error.message.includes('đã tồn tại')) {
            return res.status(409).json({ success: false, message: error.message });
        }
        if (error.name === 'SequelizeValidationError') {
             return res.status(400).json({ success: false, message: error.message });
        }
        res.status(500).json({ success: false, message: 'Lỗi máy chủ nội bộ khi cập nhật khách hàng.' });
    }
};

/**
 * Controller to delete a customer by ID (soft delete).
 */
const deleteCtrl = async (req, res) => { // Renamed to avoid keyword conflict
    try {
        const customerId = req.params.id;

        if (isNaN(parseInt(customerId))) {
            return res.status(400).json({ success: false, message: 'ID khách hàng không hợp lệ.' });
        }

        await customerService.deleteCustomer(customerId);

        res.status(200).json({
            success: true,
            message: 'Xóa khách hàng thành công!'
        });
    } catch (error) {
        console.error("Delete Customer Error:", error.message);
        if (error.message.includes('Không tìm thấy')) {
            return res.status(404).json({ success: false, message: error.message });
        }
        res.status(500).json({ success: false, message: 'Lỗi máy chủ nội bộ khi xóa khách hàng.' });
    }
};

module.exports = {
    create,
    getAll,
    getById,
    update,
    deleteCtrl // Use the new name
};