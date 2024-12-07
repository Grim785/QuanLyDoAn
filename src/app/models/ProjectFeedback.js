const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');

// Định nghĩa model ProjectFeedback
const ProjectFeedback = sequelize.define('ProjectFeedback', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    project_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Projects', // Tên bảng liên kết
            key: 'id', // Khóa chính của bảng Projects
        },
        onDelete: 'CASCADE',  // Nếu project bị xóa thì feedback sẽ bị xóa theo
        onUpdate: 'CASCADE',  // Nếu project ID bị cập nhật thì feedback sẽ được cập nhật theo
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Users', // Tên bảng liên kết
            key: 'id', // Khóa chính của bảng Users
        },
        onDelete: 'CASCADE',  // Nếu user bị xóa thì feedback sẽ bị xóa theo
        onUpdate: 'CASCADE',  // Nếu user ID bị cập nhật thì feedback sẽ được cập nhật theo
    },
    message: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW, // Tự động tạo thời gian khi bản ghi được tạo
    },
}, {
    timestamps: false, // Không sử dụng createdAt, updatedAt mặc định
    tableName: 'ProjectFeedback', // Tên bảng trong cơ sở dữ liệu
});

// Xuất model
module.exports = ProjectFeedback;
