const { Category, Product } = require('../models'); // Import Category từ models/index.js

// Lấy tất cả danh mục (GET /categories)
const getAllCategories = async (req, res) => {
    try {
        const categories = await Category.findAll();
        res.status(200).json({
            success: true,
            data: categories
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi lấy danh sách danh mục',
            error: error.message
        });
    }
};
const getProductsByCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const category = await Category.findByPk(id);
        if (!category) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy danh mục'
            });
        }

        const products = await Product.findAll({
            where: { categoryId: id },
            include: [{ model: Category }], raw: false, nest: true,
            order: [['createdAt', 'DESC']],
            limit: 20
        });

        res.status(200).json({
            success: true,
            data: {
                category: category,
                products: products
            }
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: 'Lỗi khi lấy sản phẩm theo danh mục',
            error: error.message
        });
    }
};

// Lấy danh mục theo ID (GET /categories/:id)
const getCategoryById = async (req, res) => {
    try {
        const { id } = req.params;
        const category = await Category.findByPk(id);
        if (!category) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy danh mục'
            });
        }
        res.status(200).json({
            success: true,
            data: category
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi lấy danh mục',
            error: error.message
        });
    }
};

// Tạo danh mục mới (POST /categories)
const createCategory = async (req, res) => {
    try {
        const { name, description } = req.body;
        const category = await Category.create({
            name,
            description
        });
        res.status(201).json({
            success: true,
            data: category
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Lỗi khi tạo danh mục',
            error: error.message
        });
    }
};

// Cập nhật danh mục (PUT /categories/:id)
const updateCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description } = req.body;
        const category = await Category.findByPk(id);
        if (!category) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy danh mục'
            });
        }
        await category.update({
            name,
            description
        });
        res.status(200).json({
            success: true,
            data: category
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Lỗi khi cập nhật danh mục',
            error: error.message
        });
    }
};

// Xóa danh mục (DELETE /categories/:id)
const deleteCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const category = await Category.findByPk(id);
        if (!category) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy danh mục'
            });
        }
        // Kiểm tra nếu có Product liên kết (optional: cascade delete hoặc lỗi)
        const productCount = await category.countProducts();
        if (productCount > 0) {
            return res.status(400).json({
                success: false,
                message: 'Không thể xóa danh mục vì còn sản phẩm liên kết'
            });
        }
        await category.destroy();
        res.status(200).json({
            success: true,
            message: 'Xóa danh mục thành công'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi xóa danh mục',
            error: error.message
        });
    }
};

module.exports = {
    getAllCategories,
    getCategoryById,
    createCategory,
    updateCategory,
    deleteCategory,
    getProductsByCategory
};