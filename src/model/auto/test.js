/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('test', {
    id: {
      type: DataTypes.CHAR(36),
      allowNull: false,
      primaryKey: true
    },
    number: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    description: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false
    },
    createUserId: {
      type: DataTypes.CHAR(36),
      allowNull: true
    },
    updateUserId: {
      type: DataTypes.CHAR(36),
      allowNull: true
    },
    baseId: {
      type: DataTypes.CHAR(36),
      allowNull: true
    }
  }, {
    tableName: 'test',
    timestamps: false,
    paranoid: false,
    underscored: false,
    freezeTableName: true,
    version: false
  });
};
