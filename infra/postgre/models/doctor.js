'use strict'
const { Model } = require('sequelize')
const { modelInit } = require('../config')
module.exports = (sequelize, DataTypes) => {
  class Doctor extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Doctor.belongsTo(models.User, {
        foreignKey: 'userId',
        as: 'user',
      })
      Doctor.hasMany(models.DoctorClinic, {
        foreignKey: 'doctorId',
        as: 'doctorClinics',
      })
    }
  }
  Doctor.init(
    {
      id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.BIGINT,
        autoIncrement: true,
      },
      guid: {
        allowNull: false,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },
      specialist: {
        unique: true,
        type: DataTypes.STRING,
      },
      userId: {
        type: DataTypes.BIGINT,
        references: {
          model: 'users',
          key: 'id',
        },
        field: 'user_id',
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
      modelName: 'Doctor',
    }
  )
  return Doctor
}
