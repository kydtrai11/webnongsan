const db = require('../models');
const { Product, Category } = require('../models');
const { Op } = require('sequelize'); // Import Op cho tìm kiếm LIKE

// Lấy tất cả sản phẩm (GET /products)
const getAllProducts = async (req, res) => {
    try {
        const products = await Product.findAll({
            include: [{ model: Category }], raw: false, nest: true, // Sử dụng alias 'category' từ association
        });
        res.status(200).json({
            success: true,
            data: products
        });
    } catch (error) {
        console.log(error);

        res.status(500).json({
            success: false,
            message: 'Lỗi khi lấy danh sách sản phẩm',
            error: error.message
        });
    }
};

// Tìm kiếm sản phẩm theo tên (GET /products/search?q=query)
const searchProducts = async (req, res) => {
    try {
        const { q } = req.query;
        if (!q) {
            return res.status(400).json({
                success: false,
                message: 'Thiếu tham số tìm kiếm (q)'
            });
        }
        const products = await Product.findAll({
            where: {
                name: { [Op.like]: `%${q}%` } // Tìm kiếm không phân biệt hoa thường
            },
            // include: [{ model: Category }] // Bao gồm thông tin danh mục
        });

        res.status(200).json({
            success: true,
            data: products,
            count: products.length
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi tìm kiếm sản phẩm',
            error: error.message
        });
    }
};

// Lấy sản phẩm theo ID (GET /products/:id)
const getProductById = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Product.findByPk(id, {
            // include: [{ model: Category }] // Sử dụng Category đã import
        });
        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy sản phẩm'
            });
        }
        res.status(200).json({
            success: true,
            data: product
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi lấy sản phẩm',
            error: error.message
        });
    }
};

// Tạo sản phẩm mới (POST /products)
const createProduct = async (req, res) => {
    try {
        const { name, description, basePrice, imageUrl, tags, isSeasonal, categoryId } = req.body;
        const product = await Product.create({
            name,
            description,
            basePrice,
            imageUrl,
            tags,
            isSeasonal,
            CategoryId: categoryId // FK cho Category
        });
        res.status(201).json({
            success: true,
            data: product
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Lỗi khi tạo sản phẩm',
            error: error.message
        });
    }
};

// Cập nhật sản phẩm (PUT /products/:id)
const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, basePrice, imageUrl, tags, isSeasonal, categoryId } = req.body;
        const product = await Product.findByPk(id);
        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy sản phẩm'
            });
        }
        await product.update({
            name,
            description,
            basePrice,
            imageUrl,
            tags,
            isSeasonal,
            CategoryId: categoryId
        });
        res.status(200).json({
            success: true,
            data: product
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Lỗi khi cập nhật sản phẩm',
            error: error.message
        });
    }
};

// Xóa sản phẩm (DELETE /products/:id)
const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Product.findByPk(id);
        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy sản phẩm'
            });
        }
        await product.destroy();
        res.status(200).json({
            success: true,
            message: 'Xóa sản phẩm thành công'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi xóa sản phẩm',
            error: error.message
        });
    }
};

module.exports = {
    getAllProducts,
    searchProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct
};