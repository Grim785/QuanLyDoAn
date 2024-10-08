const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db/db');

const User = sequelize.define('User', {
    user_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    role: {
        type: DataTypes.ENUM('student', 'advisor', 'admin'),
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    full_name: {
        type: DataTypes.STRING,
    },
    phone_number: {
        type: DataTypes.STRING,
    },
    date_of_birth: {
        type: DataTypes.DATE,
    },
    address: {
        type: DataTypes.STRING,
    },
    position: {
        type: DataTypes.STRING,
    },
    created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
    updated_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
}, {
    timestamps: false, // Bỏ qua timestamps tự động của Sequelize nếu bạn muốn dùng cột đã định nghĩa
    tableName: 'Users',
});

module.exports = User;
