// Document Model
// Import module
const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db/db');

// Định nghĩa mô hình
const Document = sequelize.define('Document', {
    document_id: {
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
    document_type: {
        type: DataTypes.ENUM('outline', 'progress_report', 'reference'),
    },
    file_path: {
        type: DataTypes.STRING(255),
    },
    uploaded_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
}, 
// Tùy chọn mô hình
{
    timestamps: false,
    tableName: 'Documents',
});

// Xuất mô hình
module.exports = Document;