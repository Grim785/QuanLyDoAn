require('dotenv').config();  // Tải các biến môi trường từ .env

const { Sequelize } = require('sequelize');

// Kết nối với cơ sở dữ liệu MySQL bằng cách sử dụng các biến môi trường
const sequelize = new Sequelize(process.env.CONNECT_URI, {
  dialect: 'mysql',
  logging: false,  // Tắt logging nếu không cần thiết
});

sequelize.authenticate()
  .then(() => {
    console.log('Kết nối thành công!');
  })
  .catch(err => {
    console.error('Không thể kết nối: ', err);
  });
