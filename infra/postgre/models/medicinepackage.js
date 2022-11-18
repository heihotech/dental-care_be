'use strict'
const { Model } = require('sequelize')
const { modelInit } = require('../config')
module.exports = (sequelize, DataTypes) => {
  class MedicinePackage extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // MedicinePackage.belongsTo(models.Patient, {
      //   foreignKey: 'patientId',
      //   as: 'patient',
      // })
    }
  }
  MedicinePackage.init(
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
      medicineId: {
        field: 'medicine_id',
        allowNull: true,
        type: DataTypes.BIGINT,
        references: {
          model: 'medicines',
          key: 'id',
        },
      },
      medicineComponentId: {
        field: 'medicine_component_id',
        allowNull: true,
        type: DataTypes.BIGINT,
        references: {
          model: 'medicines',
          key: 'id',
        },
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
      modelName: 'MedicinePackage',
    }
  )
  return MedicinePackage
}
