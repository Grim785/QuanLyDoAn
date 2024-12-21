const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');

// Định nghĩa mô hình
const Advisor = sequelize.define('Advisors', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    advisorID: {
        type: DataTypes.STRING(10),
        allowNull: false,
        unique: true,
    },
    lastname: {
        type: DataTypes.STRING(50),
        allowNull: false,
    },
    firstname: {
        type: DataTypes.STRING(50),
        allowNull: false,
    },
    date_of_birth: {
        type: DataTypes.DATEONLY,
        allowNull: false,
    },
    gender: {
        type: DataTypes.ENUM('Nam', 'Nữ', 'Khác'),
        allowNull: false,
    },
    address: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    majorsID: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    userID: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
},
    // Tùy chọn mô hình
    {
        timestamps: true, // Tự động thêm createdAt và updatedAt
        tableName: 'advisors',
    });

// Quan hệ với các mô hình khác
Advisor.associate = (models) => {
    Advisor.belongsTo(models.Major, {
        foreignKey: 'majorsID',
        as: 'major',
    });
    Advisor.belongsTo(models.User, {
        foreignKey: 'userID',
        as: 'user',
    });
};

// Xuất mô hình
module.exports = Advisor;
