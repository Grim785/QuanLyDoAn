const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');

// Định nghĩa mô hình
const User = sequelize.define('Users', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    username: {
        type: DataTypes.STRING(50),
        allowNull: false,
    },
    password: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    role: {
        type: DataTypes.ENUM('student', 'advisor', 'admin'),
        allowNull: false,
    },
    gmail: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
    },
    phone: {
        type: DataTypes.STRING(15),
        allowNull: false,
        unique: true,
    },
    active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
    },
}, 
// Tùy chọn mô hình
{
    timestamps: true, // Tự động thêm createdAt và updatedAt
    tableName: 'Users',
});

// Xuất mô hình
module.exports = User;