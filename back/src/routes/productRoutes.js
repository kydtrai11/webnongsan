const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

// GET /api/products - Lấy tất cả
router.get('/', productController.getAllProducts);

// GET /api/products/search?q=query - Tìm kiếm sản phẩm
router.get('/search', productController.searchProducts);

// GET /api/products/:id - Lấy theo ID
router.get('/:id', productController.getProductById);

// POST /api/products - Tạo mới
router.post('/', productController.createProduct);

// PUT /api/products/:id - Cập nhật
router.put('/:id', productController.updateProduct);

// DELETE /api/products/:id - Xóa
router.delete('/:id', productController.deleteProduct);

module.exports = router;