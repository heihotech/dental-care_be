'use strict'
const { Model } = require('sequelize')
const { modelInit } = require('../config')
module.exports = (sequelize, DataTypes) => {
  class UserRole extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  UserRole.init(
    {
      id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.BIGINT,
        autoIncrement: true,
      },
      userId: {
        type: DataTypes.BIGINT,
        references: {
          model: 'users',
          key: 'id',
        },
        field: 'user_id',
      },
      roleId: {
        type: DataTypes.BIGINT,
        references: {
          model: 'roles',
          key: 'id',
        },
        field: 'role_id',
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE,
        field: 'created_at',
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE,
        field: 'updated_at',
      },
      deletedAt: {
        allowNull: true,
        type: DataTypes.DATE,
        field: 'deleted_at',
      },
    },
    {
      sequelize,
      ...modelInit,
      modelName: 'UserRole',
    }
  )
  return UserRole
}
