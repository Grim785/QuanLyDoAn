const express = require('express');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const crypto = require('crypto');
const fs = require('fs');
require('dotenv').config();

module.exports = (app) => {
    let yourSecretKey = process.env.SECRET_KEY;

    if (!yourSecretKey) {
        yourSecretKey = crypto.randomBytes(32).toString('hex');
        fs.appendFileSync('.env', `SECRET_KEY=${yourSecretKey}\n`, 'utf8');
    }

    console.log('Secret Key saved to .env:', yourSecretKey);

    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(cookieParser());

    app.use(
        session({
            secret: yourSecretKey,
            resave: false,
            saveUninitialized: true,
            cookie: { maxAge: 24 * 60 * 60 * 1000 },
        })
    );
};
