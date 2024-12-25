const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('projectfiles', {
    project_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'projects',
        key: 'id'
      }
    },
    file_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'files',
        key: 'id'
      }
    }
  }, {
    sequelize,
    tableName: 'projectfiles',
    timestamps: true,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "project_id" },
          { name: "file_id" },
        ]
      },
      {
        name: "file_id",
        using: "BTREE",
        fields: [
          { name: "file_id" },
        ]
      },
    ]
  });
};
