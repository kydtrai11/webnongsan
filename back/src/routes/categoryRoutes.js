const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');

// GET /api/categories - Lấy tất cả
router.get('/', categoryController.getAllCategories);
router.get('/categorybyproduct/:id', categoryController.getProductsByCategory);

// GET /api/categories/:id - Lấy theo ID
router.get('/:id', categoryController.getCategoryById);

// POST /api/categories - Tạo mới
router.post('/', categoryController.createCategory);

// PUT /api/categories/:id - Cập nhật
router.put('/:id', categoryController.updateCategory);

// DELETE /api/categories/:id - Xóa
router.delete('/:id', categoryController.deleteCategory);

module.exports = router;