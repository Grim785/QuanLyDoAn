const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');

// Định nghĩa mô hình
const File = sequelize.define('Files', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    file_name: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    file_path: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    uploaded_by: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    uploaded_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
}, 
// Tùy chọn mô hình
{
    timestamps: true, // Tự động thêm createdAt và updatedAt
    tableName: 'files',
});

// Quan hệ với các mô hình khác (nếu có, ví dụ liên kết với bảng User)
File.associate = (models) => {
    File.belongsTo(models.User, {
        foreignKey: 'uploaded_by',
        as: 'uploadedBy',
    });
};

// Xuất mô hình
module.exports = File;
