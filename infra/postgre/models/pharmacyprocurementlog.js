'use strict'
const { Model } = require('sequelize')
const { modelInit } = require('../config')
module.exports = (sequelize, DataTypes) => {
  class PharmacyProcurementLog extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      PharmacyProcurementLog.belongsTo(models.PharmacyProcurement, {
        foreignKey: 'pharmacyProcurementId',
        as: 'pharmacyProcurement',
      })
      PharmacyProcurementLog.belongsTo(models.PharmacyProcurementItem, {
        foreignKey: 'pharmacyProcurementItemId',
        as: 'pharmacyProcurementItem',
      })
    }
  }
  PharmacyProcurementLog.init(
    {
      id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.BIGINT,
        autoIncrement: true,
      },
      pharmacyProcurementId: {
        field: 'pharmacy_procurement_id',
        allowNull: true,
        type: DataTypes.BIGINT,
        references: {
          model: 'pharmacy_procurements',
          key: 'id',
        },
      },
      pharmacyProcurementItemId: {
        field: 'pharmacy_procurement_item_id',
        allowNull: true,
        type: DataTypes.BIGINT,
        references: {
          model: 'pharmacy_procurement_items',
          key: 'id',
        },
      },
      log: {
        type: DataTypes.JSONB,
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
      modelName: 'PharmacyProcurementLog',
    }
  )
  return PharmacyProcurementLog
}
