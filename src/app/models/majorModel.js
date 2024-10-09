//User Model
//Import module
const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db/db');

// Định nghĩa mô hình
const Major = sequelize.define('Major', {
    major_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    major_name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
}, 
//Tùy chọn mô hình
{
    timestamps: false, 
    tableName: 'Majors',
});
//Xuất mô hình
module.exports = Major;
