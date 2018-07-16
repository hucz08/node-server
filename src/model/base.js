import {Sequelize, DataTypes} from 'sequelize';
import ORM from '../common/orm';
const tableName = 'base';
const Bean = ORM.define(tableName, {
    id: {
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV1,
      allowNull: false
    },
    number: {
      type: DataTypes.STRING,
      allowNull: false
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: false
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: false
    }
  },
  {
    tableName: tableName,
    timestamps: true,
    freezeTableName: true
  }
);
Bean.belongsTo(Bean, {as: 'updateUser', foreignKey: 'updateUserId'});
Bean.belongsTo(Bean, {as: 'createUser', foreignKey: 'createUserId'});
module.exports = Bean;