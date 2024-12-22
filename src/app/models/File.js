const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');

// Định nghĩa mô hình
const File = sequelize.define('File', {
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
        allowNull: true,
        defaultValue: DataTypes.NOW,
    },
    file_size: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    file_type: {
        type: DataTypes.STRING(255),
        allowNull: true,
    },
    is_avatar: {
        type: DataTypes.TINYINT(1),
        allowNull: true,
        defaultValue: 0,
    },
}, 
// Tùy chọn mô hình
{
    timestamps: true, // Tự động thêm createdAt và updatedAt
    tableName: 'files',
    createdAt: 'createdAt', // Tên trường trong cơ sở dữ liệu
    updatedAt: 'updatedAt', // Tên trường trong cơ sở dữ liệu
    // Nếu bạn muốn sử dụng uploaded_at là một trường riêng biệt
    // Bạn có thể thêm vào model nhưng không để Sequelize tự động điều chỉnh giá trị của nó
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
