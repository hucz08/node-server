import {Sequelize, DataTypes} from 'sequelize';
import ORM from '../common/orm';
import Base from './base';

const tableName = 'test';
const Bean = ORM.define(tableName, {
    id: {
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
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
Bean.belongsTo(Base, {as: 'updateUser', foreignKey: 'updateUserId'});
Bean.belongsTo(Base, {as: 'createUser', foreignKey: 'createUserId'});
Base.hasMany(Bean, {as: 'testList', foreignKey: 'baseId'});
Bean.belongsTo(Base, {as: 'base', foreignKey: 'baseId'});


module.exports = Bean;