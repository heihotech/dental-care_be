'use strict'
const { Model } = require('sequelize')
const { modelInit } = require('../config')
module.exports = (sequelize, DataTypes) => {
  class State extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      State.hasMany(models.PharmacyProcurement, {
        foreignKey: 'currentStateId',
        as: 'pharmacyProcurements',
      })
      State.hasMany(models.PharmacyProcurementItem, {
        foreignKey: 'currentStateId',
        as: 'pharmacyProcurementItems',
      })
      State.hasMany(models.MedicineStockMovement, {
        foreignKey: 'currentStateId',
        as: 'medicineStockMovements',
      })
      State.hasMany(models.MedicineRecipe, {
        foreignKey: 'currentStateId',
        as: 'MedicineRecipes',
      })
    }
  }
  State.init(
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
      codeInt: {
        field: 'code_int',
        type: DataTypes.INTEGER,
        unique: true,
      },
      code: {
        type: DataTypes.STRING,
        unique: true,
      },
      name: {
        type: DataTypes.STRING,
        unique: true,
      },
      description: {
        allowNull: true,
        type: DataTypes.TEXT,
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
      modelName: 'State',
    }
  )
  return State
}
