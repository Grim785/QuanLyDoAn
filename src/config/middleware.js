const express = require('express');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const fs = require('fs');
const crypto = require('crypto');
const multer = require('multer');
const path = require('path');
require('dotenv').config();

module.exports = (app) => {
    // Kiểm tra và thiết lập secret key
    let yourSecretKey = process.env.SECRET_KEY;
    if (!yourSecretKey) {
        yourSecretKey = crypto.randomBytes(32).toString('hex');
        fs.appendFileSync('.env', `SECRET_KEY=${yourSecretKey}\n`, 'utf8');
    }
    console.log('Secret Key saved to .env:', yourSecretKey);

    // Cấu hình Multer
    const storage = multer.diskStorage({
        destination: function (req, file, cb) {
            const uploadDir = path.join(__dirname, '../uploads'); // Thư mục lưu file
            if (!fs.existsSync(uploadDir)) {
                fs.mkdirSync(uploadDir, { recursive: true }); // Tạo thư mục nếu chưa tồn tại
            }
            cb(null, uploadDir);
        },
        filename: function (req, file, cb) {
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
            cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
        }
    });

    const upload = multer({
        storage: storage,
        limits: { fileSize: 100 * 1024 * 1024 }, // Giới hạn 100MB
        fileFilter: function (req, file, cb) {
            const fileTypes = /pdf|doc|docx|rar|7z|zip/;
            const extName = fileTypes.test(path.extname(file.originalname).toLowerCase());
            const mimeType = fileTypes.test(file.mimetype);

            if (extName && mimeType) {
                return cb(null, true);
            } else {
                cb(new Error('Chỉ chấp nhận các file PDF, DOC, DOCX, RAR, 7z, ZIP.'));
            }
        }
    });

    // Gắn multer vào app
    app.set('upload', upload); // Lưu multer upload vào app để sử dụng trong các route/controller

    // Sử dụng các middleware
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(cookieParser());

    // Cấu hình session
    app.use(session({
        secret: yourSecretKey, // Sử dụng secret key từ .env
        resave: false,
        saveUninitialized: true,
        cookie: { maxAge: 24 * 60 * 60 * 1000 } // Session tồn tại trong 1 ngày
    }));

    // Thêm các middleware khác
};
