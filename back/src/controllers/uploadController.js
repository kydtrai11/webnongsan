const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { User } = require('../models');

import multer from 'multer';
const aws = require('aws-sdk');

const upload = multer(); // memory storage

aws.config.update({
    secretAccessKey: "YOUR_SECRET",
    accessKeyId: "YOUR_ACCESS_KEY",
    endpoint: "YOUR_R2_ENDPOINT",
    region: "auto",
});

const s3 = new aws.S3();
const BUCKET = "your-bucket-name";


exports.upload = async (req, res) => {
    try {
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) return res.status(400).json({ message: 'Email đã tồn tại' });
        const hashedPassword = await bcrypt.hash(password, 10);
        await User.create({ email, password: hashedPassword, role });
        res.status(201).json({ message: 'Đăng ký thành công' });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Đã xảy ra lỗi, vui lòng thử lại' });
    }
};

