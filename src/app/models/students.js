const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('students', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    studentID: {
      type: DataTypes.STRING(10),
      allowNull: false,
      unique: "studentID"
    },
    lastname: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    firstname: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    date_of_birth: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    gender: {
      type: DataTypes.ENUM('Nam','Nữ','Khác'),
      allowNull: false
    },
    address: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    majorsID: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 1,
      references: {
        model: 'majors',
        key: 'id'
      }
    },
    usersID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    classID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'class_',
        key: 'id'
      }
    }
  }, {
    sequelize,
    tableName: 'students',
    timestamps: true,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id" },
        ]
      },
      {
        name: "studentID",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "studentID" },
        ]
      },
      {
        name: "majorsID",
        using: "BTREE",
        fields: [
          { name: "majorsID" },
        ]
      },
      {
        name: "usersID",
        using: "BTREE",
        fields: [
          { name: "usersID" },
        ]
      },
      {
        name: "FK_students_class",
        using: "BTREE",
        fields: [
          { name: "classID" },
        ]
      },
    ]
  });
};
