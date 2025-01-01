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

const uploadExcel = multer({
    dest: 'src/public/uploads/',
});

module.exports = { uploadProject, uploadAvatar, uploadExcel };
