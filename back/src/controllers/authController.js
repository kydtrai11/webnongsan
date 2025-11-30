const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { User } = require('../models');

exports.register = async (req, res) => {
    const { email, password, role, customerName, phone, address } = req.body;
    try {
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) return res.status(400).json({ message: 'Email đã tồn tại' });
        const hashedPassword = await bcrypt.hash(password, 10);
        await User.create({ email, password: hashedPassword, role, customerName, phone, address });
        res.status(201).json({ message: 'Đăng ký thành công' });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Đã xảy ra lỗi, vui lòng thử lại' });
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ where: { email } });
        if (!user) return res.status(400).json({ message: 'Email không tồn tại' });
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) return res.status(400).json({ message: 'Mật khẩu không đúng' });
        const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, 'secret_key', { expiresIn: '1h' });
        res.json({ token, user });
    } catch (err) {
        res.status(500).json({ message: 'Đã xảy ra lỗi, vui lòng thử lại' });
    }
};

exports.forgotPassword = async (req, res) => {
    const { email } = req.body;
    try {
        const user = await User.findOne({ where: { email } });
        if (!user) return res.status(400).json({ message: 'Email không tồn tại' });
        const resetToken = jwt.sign({ id: user.id }, 'secret_key', { expiresIn: '15m' });
        await user.update({
            resetToken,
            resetTokenExpiration: new Date(Date.now() + 15 * 60 * 1000),
        });
        console.log(`Reset link: http://localhost:3000/reset-password?token=${resetToken}`);
        res.json({ message: 'Liên kết khôi phục đã được gửi', resetToken });
    } catch (err) {
        res.status(500).json({ message: 'Đã xảy ra lỗi, vui lòng thử lại' });
    }
};

exports.resetPassword = async (req, res) => {
    const { token, newPassword } = req.body;
    try {
        const user = await User.findOne({
            where: {
                resetToken: token,
                resetTokenExpiration: { [require('sequelize').Op.gt]: new Date() },
            },
        });
        if (!user) return res.status(400).json({ message: 'Token không hợp lệ hoặc đã hết hạn' });
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await user.update({
            password: hashedPassword,
            resetToken: null,
            resetTokenExpiration: null,
        });
        res.json({ message: 'Đặt lại mật khẩu thành công' });
    } catch (err) {
        res.status(500).json({ message: 'Đã xảy ra lỗi, vui lòng thử lại' });
    }
};

exports.changePassword = async (req, res) => {
    const { currentPassword, newPassword } = req.body;
    try {
        const user = await User.findByPk(req.user.id);
        if (!user) return res.status(404).json({ message: 'Người dùng không tồn tại' });
        const validPassword = await bcrypt.compare(currentPassword, user.password);
        if (!validPassword) return res.status(400).json({ message: 'Mật khẩu hiện tại không đúng' });
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await user.update({ password: hashedPassword });
        res.json({ message: 'Đổi mật khẩu thành công' });
    } catch (err) {
        res.status(500).json({ message: 'Đã xảy ra lỗi, vui lòng thử lại' });
    }
};

exports.getUsers = async (req, res) => {
    if (req.user.role !== 'admin') return res.status(403).json({ message: 'Chỉ admin được phép truy cập' });
    try {
        const users = await User.findAll();
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: 'Đã xảy ra lỗi khi lấy danh sách người dùng' });
    }
};