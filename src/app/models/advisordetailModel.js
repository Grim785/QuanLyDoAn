// AdvisorDetail Model
// Import module
const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db/db');

// Định nghĩa mô hình
const AdvisorDetail = sequelize.define('AdvisorDetail', {
    advisor_id: {
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
    office_location: {
        type: DataTypes.STRING(255),
    },
    research_interests: {
        type: DataTypes.TEXT,
    },
}, 
// Tùy chọn mô hình
{
    timestamps: false,
    tableName: 'AdvisorDetails',
});

// Xuất mô hình
module.exports = AdvisorDetail;
