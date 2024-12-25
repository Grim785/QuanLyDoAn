const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('class_', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    classID: {
      type: DataTypes.STRING(20),
      allowNull: false,
      unique: "classID"
    },
    status: {
      type: DataTypes.ENUM('active','inactive'),
      allowNull: false
    },
    majorsID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'majors',
        key: 'id'
      }
    }
  }, {
    sequelize,
    tableName: 'class_',
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
        name: "classID",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "classID" },
        ]
      },
      {
        name: "majorsID",
        using: "BTREE",
        fields: [
          { name: "majorsID" },
        ]
      },
    ]
  });
};
