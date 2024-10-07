const express = require('express')
const userRoutes = require('./routes/userRoutes')
const {create} = require('express-handlebars')

//Database mysql
const mysql = require('mysql2');
require('dotenv').config();

const app = express()
const port = 3000;

const db = require('./db');

// Cấu hình Handlebars

const hbs = create({
    extname: '.handlebars',
    defaultLayout: 'main',
    layoutsDir: 'views/layouts/',
    partialsDir: 'views/partials/',
});

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

// Sử dụng các route
app.use('/', userRoutes);
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});