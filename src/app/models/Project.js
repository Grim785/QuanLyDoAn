const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');

// Định nghĩa mô hình
const Project = sequelize.define('Projects', {
    id: {
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
        allowNull: false,
    },
    field: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    start_date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
    },
    end_date: {
        type: DataTypes.DATEONLY,
        allowNull: true,
    },
    status: {
        type: DataTypes.ENUM('not_started', 'in_progress', 'completed'),
        defaultValue: 'not_started',
    },
    advisorID: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    majorID: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    fileID: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
}, 
// Tùy chọn mô hình
{
    timestamps: true, // Tự động thêm createdAt và updatedAt
    tableName: 'projects',
});

// Quan hệ với các mô hình khác
Project.associate = (models) => {
    Project.belongsTo(models.Advisor, {
        foreignKey: 'advisorID',
        as: 'advisor',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    });
    Project.belongsTo(models.Major, {
        foreignKey: 'majorID',
        as: 'major',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    });
    Project.belongsTo(models.File, {
        foreignKey: 'fileID',
        as: 'file',
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
    });
};

// Xuất mô hình
module.exports = Project;
