// src/config/sequelize.js
const { Sequelize } = require('sequelize');
require('dotenv').config("../../../env");

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 3306,
    dialect: 'mysql',
    logging: false, // bật nếu cần debug SQL
  }
);

module.exports = sequelize;
