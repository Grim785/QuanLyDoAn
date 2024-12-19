// mid.js
const express = require('express');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const fs = require('fs');
const crypto = require('crypto');
const path = require('path');
const multer = require('multer');  // Import Multer
require('dotenv').config();

module.exports = (app) => {
    let yourSecretKey = process.env.SECRET_KEY;
    if (!yourSecretKey) {
        yourSecretKey = crypto.randomBytes(32).toString('hex');
        fs.appendFileSync('.env', `SECRET_KEY=${yourSecretKey}\n`, 'utf8');
    }

    console.log('Secret Key saved to .env:', yourSecretKey);

    // Cấu hình Multer (middleware để xử lý file upload)
    const storage = multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, 'src/public/uploads');  // Lưu trữ file vào thư mục 'public/uploads'
        },
        filename: (req, file, cb) => {
            cb(null, Date.now() + '-' + file.originalname);  // Đặt tên file với timestamp
        }
    });

    // Middleware cho file upload dự án (chỉ cho phép file nén)
    const uploadProject = multer({
        storage: storage,
        fileFilter: (req, file, cb) => {
            // Kiểm tra phần mở rộng của file
            const fileTypes = /zip|tar|rar|gz|7z/;
            const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
    
            if (extname) {
                return cb(null, true);  // Cho phép file nếu phần mở rộng đúng
            } else {
                cb(new Error('Only compressed files are allowed!'), false);  // Nếu không phải file nén thì từ chối
            }
        }
    });
    

    // Middleware cho file upload avatar (chỉ cho phép file hình ảnh)
    const uploadAvatar = multer({
        storage: storage,
        fileFilter: (req, file, cb) => {
            const fileTypes = /jpg|jpeg|png|gif/;
            const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
            const mimetype = fileTypes.test(file.mimetype);

            if (extname && mimetype) {
                return cb(null, true);  // Cho phép tải lên
            } else {
                cb(new Error('Only image files are allowed!'), false);  // Nếu không phải file hình ảnh
            }
        }
    });

    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(cookieParser());

    app.use(session({
        secret: yourSecretKey,
        resave: false,
        saveUninitialized: true,
        cookie: { maxAge: 24 * 60 * 60 * 1000 }
    }));

    // Sử dụng middleware cho trang upload dự án (chỉ cho phép file nén)
    // app.use('/files/upload/project', uploadProject.single('file'));
    app.use('/student/upload/project', uploadProject.single('file'));

    // Sử dụng middleware cho trang upload avatar (chỉ cho phép hình ảnh)
    app.use('/files/upload/avatar', uploadAvatar.single('file'));
};
