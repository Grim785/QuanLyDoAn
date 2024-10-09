const express = require('express')
const userRoutes = require('./src/routes/userRoutes')
const {create} = require('express-handlebars')
const path = require('path');

//Database mysql
const mysql = require('mysql2');
require('dotenv').config();

const app = express()
const port = 3000;

const db = require('./src/config/db/db');

// Cấu hình Handlebars

const hbs = create({
    extname: '.hbs',
    defaultLayout: 'main',
    layoutsDir: path.join(__dirname, 'src', 'resources', 'views', 'layouts'),
    partialsDir: path.join(__dirname, 'src', 'resources', 'views', 'partials'),
});

app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'src', 'resources', 'views')); // Đảm bảo đường dẫn này là chính xác


// Sử dụng các route
app.use('/', userRoutes);
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});