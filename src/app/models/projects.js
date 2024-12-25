const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('projects', {
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
    start_date: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    end_date: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    status: {
      type: DataTypes.ENUM('not_started','in_progress','completed'),
      allowNull: true,
      defaultValue: "not_started"
    },
    advisorID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'advisors',
        key: 'id'
      }
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
    tableName: 'projects',
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
        name: "advisorID",
        using: "BTREE",
        fields: [
          { name: "advisorID" },
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
