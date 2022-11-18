'use strict'
const { Model } = require('sequelize')
const { modelInit } = require('../config')
module.exports = (sequelize, DataTypes) => {
  class MedicineBatchPharmacyPool extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // MedicineBatchPharmacyPool.belongsTo(models.PharmacyPool, {
      //   foreignKey: 'pharmacyPoolId',
      //   as: 'a',
      // })
      // MedicineBatchPharmacyPool.belongsTo(models.Batch, {
      //   foreignKey: 'batchId',
      //   as: 'b',
      // })
      // MedicineBatchPharmacyPool.belongsTo(models.Medicine, {
      //   foreignKey: 'medicineId',
      //   as: 'c',
      // })
    }
  }
  MedicineBatchPharmacyPool.init(
    {
      id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.BIGINT,
        autoIncrement: true,
      },
      batchId: {
        field: 'batch_id',
        type: DataTypes.BIGINT,
        references: {
          model: 'batches',
          key: 'id',
        },
      },
      medicineId: {
        field: 'medicine_id',
        type: DataTypes.BIGINT,
        references: {
          model: 'medicines',
          key: 'id',
        },
      },
      pharmacyPoolId: {
        type: DataTypes.BIGINT,
        references: {
          model: 'pharmacy_pools',
          key: 'id',
        },
        field: 'pharmacy_pool_id',
      },
      purchasePrice: {
        field: 'purchase_price',
        type: DataTypes.DECIMAL,
      },
      sellPrice: {
        field: 'sell_price',
        type: DataTypes.DECIMAL,
      },
      tax: {
        type: DataTypes.DECIMAL,
      },
      taxPercentage: {
        field: 'tax_percentage',
        type: DataTypes.DECIMAL,
      },
      quantityReceived: {
        field: 'quantity_received',
        type: DataTypes.DECIMAL,
      },
      quantityReceivedUom: {
        field: 'quantity_received_uom',
        type: DataTypes.STRING,
      },
      quantity: {
        allowNull: true,
        type: DataTypes.DECIMAL,
      },
      uom: {
        allowNull: true,
        type: DataTypes.STRING,
      },
      expiredAt: {
        allowNull: true,
        type: DataTypes.DATE,
        field: 'expired_at',
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
      modelName: 'MedicineBatchPharmacyPool',
    }
  )
  return MedicineBatchPharmacyPool
}
