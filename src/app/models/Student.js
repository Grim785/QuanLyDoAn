const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');

const Major = require('./Major'); // Import mô hình Major
const User = require('./User');   // Import mô hình User
const Class = require('./Class'); // Import mô hình Class
const File = require('./File');

const Student = sequelize.define('Student', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    studentID: {
        type: DataTypes.STRING(10),
        allowNull: false,
        unique: true,
    },
    lastname: {
        type: DataTypes.STRING(50),
        allowNull: false,
    },
    firstname: {
        type: DataTypes.STRING(50),
        allowNull: false,
    },
    date_of_birth: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    gender: {
        type: DataTypes.ENUM('nam', 'nữ', 'khác'),
        allowNull: false,
    },
    address: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    majorsID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Major,
            key: 'id',
        },
    },
    usersID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: 'id',
        },
    },
    classID: {
        type: DataTypes.STRING(20),
        allowNull: false,
        references: {
            model: Class,
            key: 'classID',
        },
    },
},
    {
        timestamps: true, // Tự động thêm createdAt và updatedAt
        tableName: 'Students',
    });

// Thiết lập quan hệ
Student.belongsTo(Major, { foreignKey: 'majorsID', as: 'major' });
Student.belongsTo(User, { foreignKey: 'usersID', as: 'user' });
Student.belongsTo(Class, { foreignKey: 'classID', as: 'class' });
// Trong mô hình Student
Student.hasOne(File, { foreignKey: 'uploaded_by', as: 'file' });


// Xuất mô hình
module.exports = Student;