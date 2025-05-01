const mysql = require('mysql2');

const connection = mysql.createConnection({
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  {
      host: process.env.DB_HOST,
      dialect: 'mysql',
  }
});

connection.connect((err) => {
  if (err) {
    console.error('Kết nối thất bại:', err.message);
  } else {
    console.log('Kết nối MySQL thành công!');
  }
});

module.exports = connection;
