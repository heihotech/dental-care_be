'use strict'
const { Model } = require('sequelize')
const { modelInit } = require('../config')
module.exports = (sequelize, DataTypes) => {
  class Batch extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Batch.belongsToMany(models.Medicine, {
        through: models.MedicineBatchPharmacyPool,
        as: 'poolMedicines',
      })
      Batch.belongsToMany(models.PharmacyPool, {
        through: models.MedicineBatchPharmacyPool,
        as: 'poolPharmacyPools',
      })
      Batch.belongsToMany(models.Medicine, {
        through: models.MedicineStockMovement,
        as: 'poolMovementMedicines',
      })
      Batch.belongsToMany(models.PharmacyPool, {
        through: models.MedicineStockMovement,
        foreignKey: 'pharmacyPoolSourceId',
        as: 'poolMovementSourcePharmacyPools',
      })
      Batch.belongsToMany(models.PharmacyPool, {
        through: models.MedicineStockMovement,
        foreignKey: 'pharmacyPoolDestinationId',
        as: 'poolMovementDestinationPharmacyPools',
      })
      Batch.hasMany(models.PharmacyProcurementItem, {
        foreignKey: 'batchId',
        as: 'pharmacyProcurementItems',
      })
      // Batch.belongsToMany(models.Medicine, {
      //   through: models.MedicineBatch,
      //   foreignKey: 'medicineId',
      //   as: 'medicinesInBatch',
      // })
    }
  }
  Batch.init(
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
        allowNull: true,
        type: DataTypes.STRING,
      },
      dateOrder: {
        field: 'date_order',
        allowNull: true,
        type: DataTypes.DATEONLY,
      },
      dateReceived: {
        field: 'date_received',
        allowNull: true,
        type: DataTypes.DATEONLY,
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
      modelName: 'Batch',
    }
  )
  return Batch
}
