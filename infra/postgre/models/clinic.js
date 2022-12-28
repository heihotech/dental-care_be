'use strict'
const { Model } = require('sequelize')
const { modelInit } = require('../config')
module.exports = (sequelize, DataTypes) => {
  class Clinic extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Clinic.hasMany(models.DoctorClinic, {
        foreignKey: 'clinicId',
        as: 'ClinicDoctors',
      })
    }
  }
  Clinic.init(
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
      name: {
        type: DataTypes.STRING,
      },
      code: {
        type: DataTypes.STRING,
      },
      isShow: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        field: 'is_show',
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
      modelName: 'Clinic',
    }
  )
  return Clinic
}
