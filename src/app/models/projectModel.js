// Project Model
// Import module
const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db/db');

// Định nghĩa mô hình
const Project = sequelize.define('Project', {
    project_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    title: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    description: {
        type: DataTypes.TEXT,
    },
    field: {
        type: DataTypes.STRING(100),
    },
    start_date: {
        type: DataTypes.DATE,
    },
    end_date: {
        type: DataTypes.DATE,
    },
    status: {
        type: DataTypes.ENUM('not_started', 'in_progress', 'completed'),
    },
    student_id: {
        type: DataTypes.INTEGER,
        references: {
            model: 'Users', // Tên của bảng tham chiếu
            key: 'user_id'  // Tên của cột tham chiếu
        },
    },
    advisor_id: {
        type: DataTypes.INTEGER,
        references: {
            model: 'Users',
            key: 'user_id'
        },
    },
    major_id: {
        type: DataTypes.INTEGER,
        references: {
            model: 'Majors',
            key: 'major_id'
        },
    },
    created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
    updated_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
}, 
// Tùy chọn mô hình
{
    timestamps: false,
    tableName: 'Projects',
});

// Xuất mô hình
module.exports = Project;
