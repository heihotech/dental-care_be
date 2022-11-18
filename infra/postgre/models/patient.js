'use strict'
const { Model } = require('sequelize')
const { modelInit } = require('../config')
module.exports = (sequelize, DataTypes) => {
  class Patient extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Patient.hasMany(models.Insurance, {
        foreignKey: 'patientId',
        as: 'insurances',
      })
      Patient.belongsTo(models.Address, {
        foreignKey: 'addressId',
        as: 'address',
      })
      Patient.hasMany(models.Outpatient, {
        foreignKey: 'patientId',
        as: 'outpatients',
      })
    }
  }
  Patient.init(
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
      phoneNumber: {
        allowNull: true,
        type: DataTypes.STRING,
        field: 'phone_number',
      },
      email: {
        allowNull: true,
        type: DataTypes.STRING,
      },
      mrNumber: {
        allowNull: true,
        type: DataTypes.STRING,
        unique: true,
        field: 'mr_number',
      },
      bpjsNumber: {
        allowNull: true,
        type: DataTypes.STRING,
        field: 'bpjs_number',
      },
      fullName: {
        allowNull: true,
        type: DataTypes.STRING,
        field: 'full_name',
      },
      frontTitle: {
        allowNull: true,
        type: DataTypes.STRING,
        field: 'front_title',
      },
      endTitle: {
        allowNull: true,
        type: DataTypes.STRING,
        field: 'end_title',
      },
      nik: {
        allowNull: true,
        type: DataTypes.STRING,
      },
      gender: {
        allowNull: true,
        type: DataTypes.ENUM('M', 'F'),
        defaultValue: 'M',
      },
      religion: {
        allowNull: true,
        type: DataTypes.STRING,
      },
      birthDate: {
        allowNull: true,
        type: DataTypes.DATEONLY,
        field: 'birth_date',
      },
      avatarUrl: {
        allowNull: true,
        type: DataTypes.STRING,
        field: 'avatar_url',
      },
      isIndonesian: {
        allowNull: true,
        type: DataTypes.BOOLEAN,
        field: 'is_indonesian',
      },
      addressId: {
        allowNull: true,
        type: DataTypes.BIGINT,
        references: {
          model: 'addresses',
          key: 'id',
        },
        field: 'address_id',
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
      modelName: 'Patient',
    }
  )
  return Patient
}
