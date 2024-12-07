const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');

// Định nghĩa model SuggestedProjects
const SuggestedProjects = sequelize.define('SuggestedProjects', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    title: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
}, {
    timestamps: true,
    tableName: 'suggestedprojects', // Tên bảng trong cơ sở dữ liệu
});

// Xuất model
module.exports = SuggestedProjects;
