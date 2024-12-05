const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');

const Major = require('./Major'); // Import Major để tạo quan hệ

// Định nghĩa mô hình
const Class = sequelize.define('Class', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    classID: {
        type: DataTypes.STRING(20),
        allowNull: false,
        unique: true,
    },
    status: {
        type: DataTypes.ENUM('active', 'inactive'),
        allowNull: false,
    },
    majorsID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Major,
            key: 'id',
        },
    },
}, 
{
    timestamps: true,
    tableName: 'Class',
});

// Thiết lập quan hệ
Class.belongsTo(Major, { foreignKey: 'majorsID', as: 'major' });

// Xuất mô hình
module.exports = Class;