'use strict';

const db = require('../models'); 
const { sequelize, Customer, Product, ColorProduct, SizeProduct, Order, OrderDetail, Inventory } = db; 
const { Op } = db.Sequelize;

const createOrder = async (orderData) => {
    const { customerId, items } = orderData;

    if (!customerId) {
        throw new Error('customerId là bắt buộc.');
    }
    if (!items || !Array.isArray(items) || items.length === 0) {
        throw new Error('Danh sách mặt hàng (items) là bắt buộc và không được rỗng.');
    }

    const transaction = await sequelize.transaction();

    try {
        const customer = await Customer.findByPk(customerId, { transaction });
        if (!customer) {
            await transaction.rollback();
            throw new Error(`Khách hàng với ID ${customerId} không tồn tại.`);
        }

        const newOrder = await Order.create({
            customer_id: customerId,
            orderstatus: '0', 
            orderdate: new Date()
        }, { transaction });

        const orderDetailsToCreate = [];
        const inventoryUpdates = [];

        for (const item of items) {
            if (!item.productId || !item.colorProductId || !item.sizeProductId || !item.quantity || item.quantity <= 0) {
                throw new Error('Mỗi mặt hàng phải có productId, colorProductId, sizeProductId và quantity > 0.');
            }

            const product = await Product.findByPk(item.productId, { transaction });
            const colorProduct = await ColorProduct.findByPk(item.colorProductId, { transaction });
            const sizeProduct = await SizeProduct.findByPk(item.sizeProductId, { transaction });

            console.log("check size: ", sizeProduct)

            if (!product) {
                throw new Error(`Sản phẩm với ID ${item.productId} không tồn tại.`);
            }
            if (!colorProduct) {
                throw new Error(`Biến thể màu với ID ${item.colorProductId} không tồn tại.`);
            }
            if (!sizeProduct) {
                throw new Error(`Biến thể kích thước với ID ${item.sizeProductId} không tồn tại.`);
            }

            if (colorProduct.product_id !== product.id) {
                throw new Error(`Màu ID ${item.colorProductId} không thuộc sản phẩm ID ${product.id}.`);
            }
            if (sizeProduct.product_id !== product.id) {
                throw new Error(`Kích thước ID ${item.sizeProductId} không thuộc sản phẩm ID ${product.id}.`);
            }

            const inventoryItem = await Inventory.findOne({
                where: {
                    color_product_id: item.colorProductId,
                    size_product_id: item.sizeProductId
                },
                transaction
            });

            if (!inventoryItem || inventoryItem.quantity < item.quantity) {
                throw new Error(`Sản phẩm "${product.name}" (Màu: ${colorProduct.name}, Size: ${sizeProduct.name}) không đủ số lượng tồn kho. Yêu cầu: ${item.quantity}, Hiện có: ${inventoryItem ? inventoryItem.quantity : 0}.`);
            }

            
            const unitPrice = (Number(product.price) || 0) +
                              (Number(colorProduct.price) || 0) +
                              (Number(sizeProduct.price) || 0);

            orderDetailsToCreate.push({
                orders_id: newOrder.id,
                products_id: item.productId,
                color_product_id: item.colorProductId,
                size_product_id: item.sizeProductId,
                quantity: item.quantity,
                price: unitPrice, 
                image_url: item.imageUrl || product.image_url || null 
            });

            inventoryUpdates.push({
                inventoryItem: inventoryItem,
                quantityToDecrement: item.quantity
            });
        }

        // 4. Tạo các bản ghi OrderDetail
        await OrderDetail.bulkCreate(orderDetailsToCreate, { transaction });

        // 5. Cập nhật số lượng tồn kho (sau khi chắc chắn OrderDetail đã tạo thành công)
        for (const update of inventoryUpdates) {
            await update.inventoryItem.decrement('quantity', { by: update.quantityToDecrement, transaction });
        }

        // Nếu mọi thứ thành công, commit transaction
        await transaction.commit();

        // Lấy lại đơn hàng với đầy đủ chi tiết để trả về
        const createdOrderWithDetails = await Order.findByPk(newOrder.id, {
            include: [
                { model: Customer, as: 'customer' },
                {
                    model: OrderDetail,
                    as: 'orderDetails',
                    include: [
                        { model: Product, as: 'product' },
                        { model: ColorProduct, as: 'colorVariant' },
                        { model: SizeProduct, as: 'sizeVariant' }
                    ]
                }
            ]
        });

        return createdOrderWithDetails;

    } catch (error) {
        if (transaction.finished !== 'commit') {
             await transaction.rollback();
        }
        console.error("Create Order Service Error:", error.message);
        throw error; 
    }
};


const getOrdersByCustomerId = async (customerId, options = {}) => {
    const page = parseInt(options.page, 10) || 1;
    const limit = parseInt(options.limit, 10) || 10;
    const offset = (page - 1) * limit;

    const { count, rows } = await Order.findAndCountAll({
        where: { customer_id: customerId },
        include: [
            {
                model: OrderDetail,
                as: 'orderDetails',
                include: [
                    { model: Product, as: 'product', attributes: ['id', 'name', 'image_url'] },
                    { model: ColorProduct, as: 'colorVariant', attributes: ['id', 'name'] },
                    { model: SizeProduct, as: 'sizeVariant', attributes: ['id', 'name'] }
                ]
            }
        ],
        order: [['orderdate', 'DESC']],
        limit,
        offset
    });

    return {
        totalPages: Math.ceil(count / limit),
        currentPage: page,
        totalOrders: count,
        orders: rows
    };
};


const getOrderById = async (orderId, customerId = null) => {
    const whereCondition = { id: orderId };
    if (customerId) {
        whereCondition.customer_id = customerId; 
    }

    const order = await Order.findOne({
        where: whereCondition,
        include: [
            { model: Customer, as: 'customer', attributes: ['id', 'name', 'email'] },
            {
                model: OrderDetail,
                as: 'orderDetails',
                include: [
                    { model: Product, as: 'product', attributes: ['id', 'name'] },
                    { model: ColorProduct, as: 'colorVariant', attributes: ['id', 'name'] },
                    { model: SizeProduct, as: 'sizeVariant', attributes: ['id', 'name'] }
                ]
            }
        ]
    });

    if (!order) {
        if (customerId) {
            throw new Error(`Không tìm thấy đơn hàng với ID ${orderId} cho khách hàng này hoặc bạn không có quyền truy cập.`);
        }
        throw new Error(`Không tìm thấy đơn hàng với ID ${orderId}.`);
    }
    return order;
};

module.exports = {
    createOrder,
    getOrdersByCustomerId,
    getOrderById
};

