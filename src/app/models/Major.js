const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');

const Major = sequelize.define('Major', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },
}, 
{
    timestamps: true, // Tự động thêm createdAt và updatedAt
    tableName: 'Majors',
});

// Xuất mô hình
module.exports = Major;