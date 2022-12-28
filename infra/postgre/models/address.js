'use strict'
const { Model } = require('sequelize')
const { modelInit } = require('../config')
module.exports = (sequelize, DataTypes) => {
  class Address extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Address.belongsTo(models.Village, {
        foreignKey: 'villageId',
        as: 'village',
      })
      Address.hasOne(models.Profile, { foreignKey: 'addressId', as: 'profile' })
      Address.hasOne(models.Patient, {
        foreignKey: 'addressId',
        as: 'patient',
      })
    }
  }
  Address.init(
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.BIGINT,
      },
      guid: {
        allowNull: false,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },
      location: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      villageId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: 'villages',
          key: 'id',
        },
        field: 'village_id',
      },
      phone: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      zipCode: {
        type: DataTypes.STRING,
        allowNull: true,
        field: 'zip_code',
      },
      latitude: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      longitude: {
        type: DataTypes.STRING,
        allowNull: true,
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
      modelName: 'Address',
    }
  )
  return Address
}
