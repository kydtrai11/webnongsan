const express = require('express');
const jwt = require('jsonwebtoken');
const authController = require('../controllers/authController');

const router = express.Router();

const authenticateToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Không có token' });
    jwt.verify(token, 'secret_key', (err, user) => {
        if (err) return res.status(403).json({ message: 'Token không hợp lệ' });
        req.user = user;
        next();
    });
};

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password', authController.resetPassword);
router.post('/change-password', authenticateToken, authController.changePassword);
router.get('/users', authenticateToken, authController.getUsers);

module.exports = router;