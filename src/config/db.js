require('dotenv').config();
const { Sequelize } = require('sequelize');

// console.log('DB_NAME:', process.env.DB_NAME);
// console.log('DB_USERNAME:', process.env.DB_USERNAME);
// console.log('DB_PASSWORD:', process.env.DB_PASSWORD);

const sequelize = new Sequelize(process.env.CONNECT_URI, {
    dialect: 'mysql',
    logging: false,
  });

module.exports = sequelize;
