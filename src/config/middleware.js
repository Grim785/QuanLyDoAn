const express = require('express');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const fs = require('fs');
const crypto = require('crypto');
require('dotenv').config();

module.exports = (app) => {
    // Kiểm tra và thiết lập secret key
    let yourSecretKey = process.env.SECRET_KEY;
    if (!yourSecretKey) {
        yourSecretKey = crypto.randomBytes(32).toString('hex');
        fs.appendFileSync('.env', `SECRET_KEY=${yourSecretKey}\n`, 'utf8');
    }
    console.log('Secret Key saved to .env:', yourSecretKey);

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
