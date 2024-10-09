// StudentDetail Model
// Import module
const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db/db');

// Định nghĩa mô hình
const StudentDetail = sequelize.define('StudentDetail', {
    student_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
    },
    user_id: {
        type: DataTypes.INTEGER,
        references: {
            model: 'Users', // Tên của bảng tham chiếu
            key: 'user_id'  // Tên của cột tham chiếu
        },
    },
    major_id: {
        type: DataTypes.INTEGER,
        references: {
            model: 'Majors',
            key: 'major_id'
        },
    },
    year_of_study: {
        type: DataTypes.INTEGER,
    },
    gpa: {
        type: DataTypes.FLOAT,
    },
}, 
// Tùy chọn mô hình
{
    timestamps: false,
    tableName: 'StudentDetails',
});

// Xuất mô hình
module.exports = StudentDetail;