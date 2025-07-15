'use strict';

const db = require('../models');
const { Op } = db.Sequelize;
const CartItem = db.CartItem;
const Product = db.Product;
const ColorProduct = db.ColorProduct;
const SizeProduct = db.SizeProduct;


const addItemToCart = async (customerId, itemData) => {
    const { product_id, color_product_id, size_product_id, quantity } = itemData;

    if (!product_id || !color_product_id || !size_product_id || !quantity || quantity < 1) {
        throw new Error('Thông tin sản phẩm, biến thể và số lượng là bắt buộc.');
    }

    
    const productVariantExists = await Promise.all([
        Product.findByPk(product_id),
        ColorProduct.findByPk(color_product_id),
        SizeProduct.findByPk(size_product_id),
    ]);

    if (productVariantExists.some(item => !item)) {
        throw new Error('Sản phẩm hoặc biến thể được chọn không tồn tại.');
    }
    
   
    const existingItem = await CartItem.findOne({
        where: {
            customer_id: customerId,
            product_id: product_id,
            color_product_id: color_product_id,
            size_product_id: size_product_id,
        }
    });

    if (existingItem) {
        const newQuantity = existingItem.quantity + quantity;
        await existingItem.update({ quantity: newQuantity });
        return existingItem;
    } else {
        const newItem = await CartItem.create({
            customer_id: customerId,
            product_id,
            color_product_id,
            size_product_id,
            quantity
        });
        return newItem;
    }
};


const getCustomerCart = async (customerId) => {
    return await CartItem.findAll({
        where: { customer_id: customerId },
        order: [['createdAt', 'DESC']],
        include: [
            {
                model: Product,
                as: 'product',
                attributes: ['id', 'name', 'image_url'] 
            },
            {
                model: ColorProduct,
                as: 'colorVariant',
                attributes: ['id', 'name', 'price', 'colorCode', 'image_urls']
            },
            {
                model: SizeProduct,
                as: 'sizeVariant',
                attributes: ['id', 'name', 'price']
            }
        ]
    });
};


const updateCartItem = async (customerId, itemId, quantity) => {
    if (quantity < 1) {
        throw new Error('Số lượng phải lớn hơn hoặc bằng 1.');
    }

    const cartItem = await CartItem.findOne({
        where: {
            id: itemId,
            customer_id: customerId 
        }
    });

    if (!cartItem) {
        throw new Error('Không tìm thấy sản phẩm trong giỏ hàng.');
    }
    await cartItem.update({ quantity });
    return cartItem;
};



const removeCartItem = async (customerId, itemId) => {
    const cartItem = await CartItem.findOne({
        where: {
            id: itemId,
            customer_id: customerId 
        }
    });

    if (!cartItem) {
        throw new Error('Không tìm thấy sản phẩm trong giỏ hàng để xóa.');
    }

    await cartItem.destroy(); 
};

module.exports = {
    addItemToCart,
    getCustomerCart,
    updateCartItem,
    removeCartItem
};