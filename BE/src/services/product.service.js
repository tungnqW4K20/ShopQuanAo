// src/services/product.service.js
'use strict';

const db = require('../models'); // Adjust path if necessary
const Product = db.Product;
const Category = db.Category; // For eager loading and validation
const { Op } = db.Sequelize;

/**
 * Create a new product.
 * @param {object} productData - Data for the new product.
 * @returns {Promise<Product>} - The created product.
 * @throws {Error} - If validation fails or category not found.
 */
const createProduct = async (productData) => {
    const { name, description, price, image_url, category_id } = productData;

    if (!name || !description) {
        throw new Error('Tên sản phẩm và mô tả là bắt buộc.');
    }

    if (category_id) {
        const category = await Category.findByPk(category_id);
        if (!category) {
            throw new Error(`Không tìm thấy danh mục với ID ${category_id}.`);
        }
    }
    
   

    try {
        const newProduct = await Product.create({
            name,
            description,
            price, 
            image_url, 
            category_id 
        });
        return await Product.findByPk(newProduct.id, {
            include: [{ model: Category, as: 'category' }]
        });
    } catch (error) {
        if (error.name === 'SequelizeValidationError') {
            const messages = error.errors.map(e => e.message).join(', ');
            throw new Error(`Lỗi validation: ${messages}`);
        }
        throw error; 
    }
};

const getAllProducts = async (queryParams = {}) => {
    let { limit, offset, categoryId, search, isFeatured } = queryParams;

    if(!isFeatured) {
        isFeatured = false;
    }

    const options = {
        include: [{
            model: Category,
            as: 'category',
            attributes: ['id', 'name'] 
        }],
        where: {},
        order: [['createdAt', 'DESC']], 
    };

    if (isFeatured === 'true' || isFeatured === true) {
        options.where.featured = true;
    }

    if (limit) options.limit = parseInt(limit);
    if (offset) options.offset = parseInt(offset);

    if (categoryId) {
        options.where.category_id = categoryId;
    }

    if (search) {
        options.where.name = { [Op.iLike]: `%${search}%` }; 
    }

    

    return await Product.findAndCountAll(options);
};


const getProductById = async (productId) => {
    const product = await Product.findByPk(productId, {
        include: [
            { model: Category, as: 'category', attributes: ['id', 'name'] },
        ]
    });

    if (!product) {
        throw new Error(`Không tìm thấy sản phẩm với ID ${productId}.`);
    }
    return product;
};


const updateProduct = async (productId, updateData) => {
    const product = await Product.findByPk(productId);

    if (!product) {
        throw new Error(`Không tìm thấy sản phẩm với ID ${productId} để cập nhật.`);
    }

    const { name, description, price, image_url, category_id } = updateData;

    if (category_id !== undefined) { 
        if (category_id === null) { 
            product.category_id = null;
        } else {
            const category = await Category.findByPk(category_id);
            if (!category) {
                throw new Error(`Không tìm thấy danh mục với ID ${category_id}.`);
            }
            product.category_id = category_id;
        }
    }
    
    
    
    if (name !== undefined) product.name = name;
    if (description !== undefined) product.description = description;
    if (price !== undefined) product.price = price; 
    if (image_url !== undefined) product.image_url = image_url; 

    try {
        await product.save(); 
        return await Product.findByPk(product.id, {
            include: [{ model: Category, as: 'category' }]
        });
    } catch (error) {
        if (error.name === 'SequelizeValidationError') {
            const messages = error.errors.map(e => e.message).join(', ');
            throw new Error(`Lỗi validation: ${messages}`);
        }
        throw error; 
    }
};


const deleteProduct = async (productId) => {
    const product = await Product.findByPk(productId);

    if (!product) {
        throw new Error(`Không tìm thấy sản phẩm với ID ${productId} để xóa.`);
    }

    await product.destroy(); 
};

module.exports = {
    createProduct,
    getAllProducts,
    getProductById,
    updateProduct,
    deleteProduct
};