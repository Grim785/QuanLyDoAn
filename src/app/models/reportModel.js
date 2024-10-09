// Report Model
// Import module
const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db/db');

// Định nghĩa mô hình
const Report = sequelize.define('Report', {
    report_id: {
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
    content: {
        type: DataTypes.TEXT,
    },
    generated_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
}, 
// Tùy chọn mô hình
{
    timestamps: false,
    tableName: 'Reports',
});

// Xuất mô hình
module.exports = Report;
