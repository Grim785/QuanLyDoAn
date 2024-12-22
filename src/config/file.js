const multer = require('multer');
const path = require('path');
const fs = require('fs');
const s3 = require('./aws'); // Import cấu hình AWS từ file config
require('dotenv').config();

// Cấu hình Multer storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'src/public/uploads'),
    filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname),
});

// Middleware cho file upload dự án (chỉ cho phép file nén)
const uploadProject = multer({
    storage,
    fileFilter: (req, file, cb) => {
        const fileTypes = /zip|tar|rar|gz|7z/;
        const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
        extname ? cb(null, true) : cb(new Error('Only compressed files are allowed!'));
    },
});

// Middleware cho file upload avatar (chỉ cho phép file hình ảnh)
const uploadAvatar = multer({
    storage,
    fileFilter: (req, file, cb) => {
        const fileTypes = /jpg|jpeg|png|gif/;
        const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = fileTypes.test(file.mimetype);
        extname && mimetype ? cb(null, true) : cb(new Error('Only image files are allowed!'));
    },
});

// Middleware xử lý sau khi upload file
const handleUpload = async (req, res, next) => {
    try {
        const uploadedFile = req.file;
        if (!uploadedFile) throw new Error('File upload failed!');

        const filePath = uploadedFile.path;
        const s3Params = {
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: `${Date.now()}-${uploadedFile.filename}`,
            Body: fs.createReadStream(filePath),
            ContentType: uploadedFile.mimetype,
        };

        // Upload file lên S3
        const s3Response = await s3.upload(s3Params).promise();

        console.log('File uploaded to S3:', s3Response.Location);

        // // Xóa file tạm
        // fs.unlink(filePath, (err) => {
        //     if (err) console.error('Failed to delete temp file:', err);
        // });

        req.file.s3Location = s3Response.Location; // Thêm URL file vào request
        next();
    } catch (error) {
        next(error);
    }
};

module.exports = { uploadProject, uploadAvatar, handleUpload };
