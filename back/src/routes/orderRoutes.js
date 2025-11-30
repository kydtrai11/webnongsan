const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { authenticateToken } = require('../middleware/authMiddleware');

// helper to check admin role
const requireAdmin = (req, res, next) => {
	if (!req.user || req.user.role !== 'admin') return res.status(403).json({ message: 'Chỉ admin được phép' });
	next();
};

// POST /api/orders - tạo đơn hàng (yêu cầu đăng nhập)
router.post('/', authenticateToken, orderController.createOrder);

// GET /api/orders - lấy tất cả đơn hàng (admin)
router.get('/', authenticateToken, requireAdmin, orderController.getOrders);

// GET /api/orders/my - lấy đơn hàng của user đăng nhập
router.get('/my', authenticateToken, orderController.getMyOrders);

// PUT /api/orders/:id - cập nhật đơn hàng (ví dụ: status) - admin hoặc owner
router.put('/:id', authenticateToken, orderController.updateOrder);

// POST /api/orders/:id/return - yêu cầu trả hàng (owner)
router.post('/:id/return', authenticateToken, orderController.requestReturn);

// POST /api/orders/:id/reorder - mua lại (owner)
router.post('/:id/reorder', authenticateToken, orderController.reorder);

module.exports = router;
