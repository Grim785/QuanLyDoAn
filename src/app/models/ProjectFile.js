const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');

// Định nghĩa mô hình
const ProjectFile = sequelize.define('ProjectFiles', {
    project_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
    },
    file_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
    },
}, 
// Tùy chọn mô hình
{
    timestamps: true, // Tự động thêm createdAt và updatedAt
    tableName: 'projectfiles',
});

// Quan hệ với các mô hình khác
ProjectFile.associate = (models) => {
    ProjectFile.belongsTo(models.Project, {
        foreignKey: 'project_id',
        as: 'project',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    });
    ProjectFile.belongsTo(models.File, {
        foreignKey: 'file_id',
        as: 'file',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    });
};

// Xuất mô hình
module.exports = ProjectFile;
