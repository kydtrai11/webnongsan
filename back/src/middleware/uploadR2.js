import handleSharp from '../untils/sharp/sharp';
const aws = require('aws-sdk')
const axios = require('axios');
import multer from 'multer';


aws.config.update({
    secretAccessKey: "2d6f0176d0dc4a8074214cecf3235c1bc00e9830328d93e2373b2af4e77248ff",
    accessKeyId: "dc4b6c4a9f309417adb2f83d3ec83a6c",
    endpoint: "https://c2416910e13ba433cc4695ad9336a267.r2.cloudflarestorage.com",
    region: "auto"
});
const BUCKET = "nongsan"

const s3 = new aws.S3({ params: { Bucket: BUCKET, }, })

export const uploadImageFromUrlToS3 = async (imageUrl, fileName, type) => {
    try {
        const response = await axios.get(imageUrl, {
            responseType: 'arraybuffer',
        });
        const buffer = Buffer.from(response.data, 'binary');
        const sharp = await handleSharp(buffer, type)
        const params = {
            Bucket: BUCKET,
            Key: BUCKET + "/" + fileName,
            Body: sharp,
            // ContentType: response.headers['content-type'],
            ContentType: "image/webp",
        };
        const data = await s3.upload(params).promise();
        return data
    } catch (error) {
        console.error({ mes: `Failed to upload image to S3: ${imageUrl} , ${error}` });
    }
};








