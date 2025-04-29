'use strict';

const db = require('../models'); // Đảm bảo đường dẫn này đúng
const Category = db.Category;
const { Op } = db.Sequelize; // Import Op nếu cần kiểm tra trùng lặp phức tạp hơn

/**
 * Tạo một category mới.
 * @param {object} categoryData - Dữ liệu cho category mới (chứa name).
 * @returns {Promise<Category>} - Category vừa được tạo.
 * @throws {Error} - Nếu tên bị thiếu hoặc đã tồn tại.
 */
const createCategory = async (categoryData) => {
    const { name } = categoryData;

    if (!name) {
        throw new Error('Tên category là bắt buộc.');
    }

    // Kiểm tra xem tên category đã tồn tại chưa (chỉ kiểm tra những category chưa bị soft delete)
    const existingCategory = await Category.findOne({
        where: {
            name: name
            // paranoid: true tự động thêm điều kiện deletedAt IS NULL
        }
    });

    if (existingCategory) {
        throw new Error(`Category với tên "${name}" đã tồn tại.`);
    }

    const newCategory = await Category.create({ name });
    return newCategory;
};

/**
 * Lấy tất cả các category (chưa bị soft delete).
 * @returns {Promise<Category[]>} - Danh sách các category.
 */
const getAllCategories = async () => {
    // paranoid: true tự động thêm điều kiện WHERE deletedAt IS NULL
    return await Category.findAll();
};

/**
 * Lấy một category theo ID (chưa bị soft delete).
 * @param {number} categoryId - ID của category cần lấy.
 * @returns {Promise<Category>} - Category tìm thấy.
 * @throws {Error} - Nếu không tìm thấy category.
 */
const getCategoryById = async (categoryId) => {
    // paranoid: true tự động thêm điều kiện WHERE deletedAt IS NULL
    const category = await Category.findByPk(categoryId);

    if (!category) {
        throw new Error(`Không tìm thấy category với ID ${categoryId}.`);
    }
    return category;
};

/**
 * Cập nhật một category theo ID.
 * @param {number} categoryId - ID của category cần cập nhật.
 * @param {object} updateData - Dữ liệu cập nhật (chứa name).
 * @returns {Promise<Category>} - Category sau khi cập nhật.
 * @throws {Error} - Nếu không tìm thấy category, tên bị thiếu, hoặc tên mới đã tồn tại ở category khác.
 */
const updateCategory = async (categoryId, updateData) => {
    const { name } = updateData;

    if (!name) {
        throw new Error('Tên category là bắt buộc để cập nhật.');
    }

    const category = await Category.findByPk(categoryId);

    if (!category) {
        throw new Error(`Không tìm thấy category với ID ${categoryId} để cập nhật.`);
    }

    // Kiểm tra nếu tên mới đã tồn tại ở một category khác
    const existingCategoryWithNewName = await Category.findOne({
        where: {
            name: name,
            id: { [Op.ne]: categoryId } // Không phải là chính category đang cập nhật
            // paranoid: true tự động thêm điều kiện deletedAt IS NULL
        }
    });

    if (existingCategoryWithNewName) {
        throw new Error(`Category với tên "${name}" đã tồn tại.`);
    }

    // Cập nhật category tìm được
    await category.update({ name });
    return category; // Trả về category đã được cập nhật
};

/**
 * Xóa một category theo ID (soft delete do paranoid: true).
 * @param {number} categoryId - ID của category cần xóa.
 * @returns {Promise<void>}
 * @throws {Error} - Nếu không tìm thấy category.
 */
const deleteCategory = async (categoryId) => {
    const category = await Category.findByPk(categoryId);

    if (!category) {
        throw new Error(`Không tìm thấy category với ID ${categoryId} để xóa.`);
    }

    // paranoid: true sẽ thực hiện soft delete (cập nhật deletedAt)
    await category.destroy();
    // Hoặc: await Category.destroy({ where: { id: categoryId } });
};


module.exports = {
    createCategory,
    getAllCategories,
    getCategoryById,
    updateCategory,
    deleteCategory
};