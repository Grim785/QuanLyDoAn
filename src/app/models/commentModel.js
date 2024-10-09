// Comment Model
// Import module
const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db/db');

// Định nghĩa mô hình
const Comment = sequelize.define('Comment', {
    comment_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    project_id: {
        type: DataTypes.INTEGER,
        references: {
            model: 'Projects', // Tên của bảng tham chiếu
            key: 'project_id'  // Tên của cột tham chiếu
        },
    },
    user_id: {
        type: DataTypes.INTEGER,
        references: {
            model: 'Users',
            key: 'user_id'
        },
    },
    content: {
        type: DataTypes.TEXT,
    },
    created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
}, 
// Tùy chọn mô hình
{
    timestamps: false,
    tableName: 'Comments',
});

// Xuất mô hình
module.exports = Comment;
