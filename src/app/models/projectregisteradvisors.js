const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('projectregisteradvisors', {
    project_register_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'projectregister',
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
    tableName: 'projectregisteradvisors',
    timestamps: true,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "project_register_id" },
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
