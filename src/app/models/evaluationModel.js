// Evaluation Model
// Import module
const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db/db');

// Định nghĩa mô hình
const Evaluation = sequelize.define('Evaluation', {
    evaluation_id: {
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
    evaluator_id: {
        type: DataTypes.INTEGER,
        references: {
            model: 'Users',
            key: 'user_id'
        },
    },
    criteria: {
        type: DataTypes.TEXT,
    },
    score: {
        type: DataTypes.FLOAT,
    },
    comments: {
        type: DataTypes.TEXT,
    },
    evaluated_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
}, 
// Tùy chọn mô hình
{
    timestamps: false,
    tableName: 'Evaluations',
});

// Xuất mô hình
module.exports = Evaluation;
