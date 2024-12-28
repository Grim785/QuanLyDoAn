const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('projectregister', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    majorID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'majors',
        key: 'id'
      }
    }
  }, {
    sequelize,
    tableName: 'projectregister',
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
        name: "majorID",
        using: "BTREE",
        fields: [
          { name: "majorID" },
        ]
      },
    ]
  });
};
