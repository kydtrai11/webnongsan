var express = require('express');
var multer = require('multer');
var aws = require('aws-sdk');

const router = express.Router();
const upload = multer(); // memory storage

aws.config.update({
    secretAccessKey: "2d6f0176d0dc4a8074214cecf3235c1bc00e9830328d93e2373b2af4e77248ff",
    accessKeyId: "dc4b6c4a9f309417adb2f83d3ec83a6c",
    endpoint: "https://c2416910e13ba433cc4695ad9336a267.r2.cloudflarestorage.com",
    region: "auto"
});

const s3 = new aws.S3();
const BUCKET = "shinmanhwa";

router.post('/upload', upload.single('file'), async (req, res) => {
    try {
        const file = req.file;
        if (!file) return res.status(400).json({ message: "Không có file" });

        const fileName = Date.now() + "-" + file.originalname;

        const uploadParams = {
            Bucket: BUCKET,
            Key: fileName,
            Body: file.buffer,
            ContentType: "imagewebp/",
        };

        const result = await s3.upload(uploadParams).promise();
        res.json({
            success: true,
            url: "https://img.shinmanhwa.com/" + result.Key // URL ảnh
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
