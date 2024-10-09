// Notification Model
// Import module
const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db/db');

// Định nghĩa mô hình
const Notification = sequelize.define('Notification', {
    notification_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    user_id: {
        type: DataTypes.INTEGER,
        references: {
            model: 'Users', // Tên của bảng tham chiếu
            key: 'user_id'  // Tên của cột tham chiếu
        },
    },
    message: {
        type: DataTypes.TEXT,
    },
    is_read: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
}, 
// Tùy chọn mô hình
{
    timestamps: false,
    tableName: 'Notifications',
});

// Xuất mô hình
module.exports = Notification;
