'use strict';

const db = require('../models'); // Adjust path if necessary
const { Order, OrderDetail, Product, ColorProduct, SizeProduct, Customer } = db;
const { Op } = db.Sequelize; // Op for complex queries
// const { sequelize } = db; // For transactions, can also use db.sequelize

/**
 * Create a new order with its details.
 * @param {object} orderData - Data for the new order.
 * @param {number} orderData.customer_id - The ID of the customer.
 * @param {Array<object>} orderData.items - Array of items in the order.
 * @param {number} orderData.items[].product_id - Base product ID.
 * @param {number} orderData.items[].color_product_id - Color variant ID.
 * @param {number} orderData.items[].size_product_id - Size variant ID.
 * @param {number} orderData.items[].quantity - Quantity of the item.
 * @returns {Promise<Order>} The created order with details.
 * @throws {Error} If validation fails or an item is invalid.
 */
const createOrder = async (orderData) => {
    const { customer_id, items } = orderData;

    if (!customer_id) {
        throw new Error('Customer ID là bắt buộc.');
    }
    if (!items || !Array.isArray(items) || items.length === 0) {
        throw new Error('Đơn hàng phải có ít nhất một sản phẩm.');
    }

    // Validate customer
    const customer = await Customer.findByPk(customer_id);
    if (!customer) {
        throw new Error(`Không tìm thấy khách hàng với ID ${customer_id}.`);
    }

    const transaction = await db.sequelize.transaction(); // Start a transaction

    try {
        // Create the main order record
        const newOrder = await Order.create({
            customer_id,
            orderstatus: '0', // Default to 'Pending'
            orderdate: new Date() // Sequelize automatically sets this if defaultValue: DataTypes.NOW is used
        }, { transaction });

        const orderDetailsToCreate = [];
        // let totalOrderAmount = 0; // You can calculate this if your Order model has a totalAmount field

        for (const item of items) {
            if (!item.product_id || !item.color_product_id || !item.size_product_id || !item.quantity || item.quantity <= 0) {
                await transaction.rollback(); // Rollback immediately on bad item data
                throw new Error('Thông tin sản phẩm trong đơn hàng không hợp lệ (thiếu ID sản phẩm, màu, size hoặc số lượng không hợp lệ).');
            }

            // Fetch product, color, and size to validate and get price
            const product = await Product.findByPk(item.product_id, { transaction });
            if (!product) {
                await transaction.rollback();
                throw new Error(`Sản phẩm với ID ${item.product_id} không tồn tại.`);
            }

            const colorVariant = await ColorProduct.findOne({
                where: { id: item.color_product_id, product_id: item.product_id },
                transaction
            });
            if (!colorVariant) {
                await transaction.rollback();
                throw new Error(`Màu sắc với ID ${item.color_product_id} không thuộc sản phẩm ID ${item.product_id} hoặc không tồn tại.`);
            }

            const sizeVariant = await SizeProduct.findOne({
                where: { id: item.size_product_id, product_id: item.product_id },
                transaction
            });
            if (!sizeVariant) {
                await transaction.rollback();
                throw new Error(`Kích thước với ID ${item.size_product_id} không thuộc sản phẩm ID ${item.product_id} hoặc không tồn tại.`);
            }

            // Determine price: Size specific price > Color specific price > Base product price
            // Note: The provided models have `price` nullable. Defaulting to product.price if variants' prices are null.
            let currentPrice = product.price; // Base price from Product
            
            if (colorVariant.price !== null && colorVariant.price !== undefined) {
                currentPrice = colorVariant.price; // Color variant price (if set)
            }
            if (sizeVariant.price !== null && sizeVariant.price !== undefined) {
                currentPrice = sizeVariant.price; // Size variant price (if set, overrides color/base)
            }
            
            if (currentPrice === null || currentPrice === undefined) {
                await transaction.rollback();
                throw new Error(`Không thể xác định giá cho sản phẩm "${product.name}" (Màu: "${colorVariant.name}", Size: "${sizeVariant.name}"). Vui lòng cấu hình giá cơ bản cho sản phẩm hoặc biến thể.`);
            }

            // Placeholder for inventory check (assuming an Inventory model that links ColorProduct and SizeProduct)
            // For example:
            // const inventoryEntry = await db.Inventory.findOne({
            //     where: { color_product_id: item.color_product_id, size_product_id: item.size_product_id },
            //     transaction
            // });
            // if (!inventoryEntry || inventoryEntry.quantity < item.quantity) {
            //     await transaction.rollback();
            //     throw new Error(`Sản phẩm ${product.name} (Màu: ${colorVariant.name}, Size: ${sizeVariant.name}) không đủ số lượng tồn kho.`);
            // }
            // Consider decrementing inventory here:
            // await inventoryEntry.decrement('quantity', { by: item.quantity, transaction });

            orderDetailsToCreate.push({
                orders_id: newOrder.id,
                products_id: item.product_id,
                color_product_id: item.color_product_id,
                size_product_id: item.size_product_id,
                quantity: item.quantity,
                price: parseFloat(currentPrice) // Price at the time of order, ensure it's a number
            });
            // totalOrderAmount += parseFloat(currentPrice) * item.quantity;
        }

        await OrderDetail.bulkCreate(orderDetailsToCreate, { transaction });

        // Optional: Update order total if you have such a field on the Order model
        // await newOrder.update({ totalAmount: totalOrderAmount }, { transaction });

        await transaction.commit();

        // Fetch the newly created order with all its details for the response
        return await Order.findByPk(newOrder.id, {
            include: [
                { model: Customer, as: 'customer', attributes: ['id', 'name', 'email'] },
                {
                    model: OrderDetail,
                    as: 'orderDetails',
                    include: [
                        { model: Product, as: 'product', attributes: ['id', 'name', 'image_url'] },
                        { model: ColorProduct, as: 'colorVariant', attributes: ['id', 'name'] },
                        { model: SizeProduct, as: 'sizeVariant', attributes: ['id', 'name'] }
                    ]
                }
            ]
        });

    } catch (error) {
        // If transaction is still pending, roll it back
        if (transaction && transaction.finished !== 'commit' && transaction.finished !== 'rollback') {
            await transaction.rollback();
        }
        console.error("Create Order Service Error:", error.message);
        // Ensure the error message is propagated or re-throw a more specific one
        if (error.message.includes('không tồn tại') || error.message.includes('không thuộc sản phẩm') || error.message.includes('không thể xác định giá')) {
             throw new Error(error.message); // Propagate specific validation errors
        }
        throw new Error('Lỗi khi tạo đơn hàng: ' + error.message); // General error
    }
};

/**
 * Get all orders.
 * @param {object} queryOptions - Filtering and pagination options.
 * @param {number} [queryOptions.limit=10] - Max number of items to return.
 * @param {number} [queryOptions.offset=0] - Number of items to skip.
 * @param {string} [queryOptions.status] - Filter by order status ('0', '1', '2').
 * @param {number} [queryOptions.customerId] - Filter by customer ID.
 * @returns {Promise<{count: number, rows: Order[]}>} List of orders and total count.
 */
const getAllOrders = async (queryOptions = {}) => {
    const { limit = 10, offset = 0, status, customerId } = queryOptions;
    const whereClause = {};
    if (status && ['0', '1', '2'].includes(status)) {
        whereClause.orderstatus = status;
    }
    if (customerId && !isNaN(parseInt(customerId))) {
        whereClause.customer_id = parseInt(customerId);
    }

    return await Order.findAndCountAll({
        where: whereClause,
        include: [
            { model: Customer, as: 'customer', attributes: ['id', 'name', 'email'] },
            // Optionally include OrderDetails count or a few details for summary
            // For full details, use getOrderById
        ],
        limit: parseInt(limit),
        offset: parseInt(offset),
        order: [['orderdate', 'DESC']],
        distinct: true // Important for correct count with includes
    });
};

/**
 * Get a specific order by ID, including all details.
 * @param {number} orderId - The ID of the order.
 * @returns {Promise<Order>} The order object.
 * @throws {Error} If order not found.
 */
const getOrderById = async (orderId) => {
    const id = parseInt(orderId);
    if (isNaN(id)) {
        throw new Error('ID đơn hàng không hợp lệ.');
    }
    const order = await Order.findByPk(id, {
        include: [
            { model: Customer, as: 'customer', attributes: ['id', 'name', 'email', 'address'] },
            {
                model: OrderDetail,
                as: 'orderDetails',
                include: [
                    { model: Product, as: 'product', attributes: ['id', 'name', 'description', 'image_url'] },
                    { model: ColorProduct, as: 'colorVariant', attributes: ['id', 'name', 'image_urls'] },
                    { model: SizeProduct, as: 'sizeVariant', attributes: ['id', 'name'] }
                ]
            }
        ]
    });
    if (!order) {
        throw new Error(`Không tìm thấy đơn hàng với ID ${id}.`);
    }
    return order;
};

/**
 * Update the status of an order.
 * @param {number} orderId - The ID of the order to update.
 * @param {string} status - The new status ('0', '1', '2').
 * @returns {Promise<Order>} The updated order.
 * @throws {Error} If order not found or status is invalid.
 */
const updateOrderStatus = async (orderId, status) => {
    const id = parseInt(orderId);
    if (isNaN(id)) {
        throw new Error('ID đơn hàng không hợp lệ.');
    }

    if (!status || !['0', '1', '2'].includes(status)) {
        throw new Error('Trạng thái đơn hàng không hợp lệ. Chỉ chấp nhận "0", "1", hoặc "2".');
    }

    const order = await Order.findByPk(id);
    if (!order) {
        throw new Error(`Không tìm thấy đơn hàng với ID ${id} để cập nhật.`);
    }

    // Potentially add logic here: e.g., cannot revert status from '2' (Shipped/Completed)
    // if (order.orderstatus === '2' && status !== '2') {
    //     throw new Error('Không thể thay đổi trạng thái của đơn hàng đã hoàn thành/đã hủy.');
    // }

    await order.update({ orderstatus: status });
    return order; // Returns the updated instance
};

/**
 * Soft delete an order by ID.
 * (OrderDetails associated will also be soft-deleted if paranoid: true and onDelete: 'CASCADE' is set on association).
 * Note: OrderDetail model has onDelete: 'CASCADE' for orders_id, so its details will also be soft-deleted.
 * @param {number} orderId - The ID of the order to delete.
 * @returns {Promise<void>}
 * @throws {Error} If order not found.
 */
const deleteOrder = async (orderId) => {
    const id = parseInt(orderId);
    if (isNaN(id)) {
        throw new Error('ID đơn hàng không hợp lệ.');
    }

    const order = await Order.findByPk(id);
    if (!order) {
        throw new Error(`Không tìm thấy đơn hàng với ID ${id} để xóa.`);
    }

    // paranoid: true on Order model ensures soft delete
    // paranoid: true on OrderDetail and onDelete: 'CASCADE' from Order to OrderDetail
    // means OrderDetail records will also be soft-deleted.
    await order.destroy();
};

module.exports = {
    createOrder,
    getAllOrders,
    getOrderById,
    updateOrderStatus,
    deleteOrder
};