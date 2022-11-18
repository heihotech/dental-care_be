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
      Doctor.belongsTo(models.Profile, {
        foreignKey: 'profileId',
        as: 'profile',
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
      profileId: {
        type: DataTypes.BIGINT,
        references: {
          model: 'profiles',
          key: 'id',
        },
        field: 'profile_id',
      },
      code: {
        unique: true,
        type: DataTypes.STRING,
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
