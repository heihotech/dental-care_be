'use strict'
const { Model } = require('sequelize')
const { modelInit } = require('../config')
module.exports = (sequelize, DataTypes) => {
  class PharmacyPool extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      PharmacyPool.belongsToMany(models.Medicine, {
        through: models.MedicineBatchPharmacyPool,
        as: 'poolMedicines',
      })
      PharmacyPool.belongsToMany(models.Batch, {
        through: models.MedicineBatchPharmacyPool,
        as: 'poolBatches',
      })
      PharmacyPool.belongsToMany(models.Medicine, {
        through: models.MedicineStockMovement,
        as: 'poolMovementMedicines',
      })
      PharmacyPool.belongsToMany(models.Batch, {
        through: models.MedicineStockMovement,
        as: 'poolMovementBatches',
      })
      // PharmacyPool.hasMany(models.MedicineBatchPharmacyPoolStock, {
      //   foreignKey: 'pharmacyPoolId',
      //   as: 'medicineBatchPharmacyPoolStock',
      // })
    }
  }
  PharmacyPool.init(
    {
      id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.BIGINT,
        autoIncrement: true,
      },
      code: {
        unique: true,
        type: DataTypes.STRING,
      },
      name: {
        type: DataTypes.STRING,
      },
      // 0: Gudang, 1: Pool pelayanan, 2: Unit consumer (ruangan)
      type: {
        type: DataTypes.INTEGER,
      },
      location: {
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
      modelName: 'PharmacyPool',
    }
  )
  return PharmacyPool
}
