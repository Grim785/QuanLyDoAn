const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('projectadvisors', {
    project_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'projects',
        key: 'id'
      }
    },
    advisor_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'advisors',
        key: 'id'
      }
    }
  }, {
    sequelize,
    tableName: 'projectadvisors',
    timestamps: true,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "project_id" },
          { name: "advisor_id" },
        ]
      },
      {
        name: "advisor_id",
        using: "BTREE",
        fields: [
          { name: "advisor_id" },
        ]
      },
    ]
  });
};
