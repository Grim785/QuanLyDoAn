const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');

// Định nghĩa mô hình
const ProjectStudent = sequelize.define('ProjectStudents', {
    project_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
    },
    student_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
    },
}, 
// Tùy chọn mô hình
{
    timestamps: true, // Tự động thêm createdAt và updatedAt
    tableName: 'projectstudents',
});

// Quan hệ với các mô hình khác
ProjectStudent.associate = (models) => {
    ProjectStudent.belongsTo(models.Project, {
        foreignKey: 'project_id',
        as: 'project',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    });
    ProjectStudent.belongsTo(models.Student, {
        foreignKey: 'student_id',
        as: 'student',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    });
};

// Xuất mô hình
module.exports = ProjectStudent;
