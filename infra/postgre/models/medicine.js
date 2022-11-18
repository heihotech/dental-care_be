'use strict'
const { Model } = require('sequelize')
const { modelInit } = require('../config')
module.exports = (sequelize, DataTypes) => {
  class Medicine extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Medicine.belongsToMany(models.Batch, {
        through: models.MedicineBatchPharmacyPool,
        as: 'poolBatches',
      })
      Medicine.belongsToMany(models.PharmacyPool, {
        through: models.MedicineBatchPharmacyPool,
        as: 'poolPharmacyPools',
      })
      Medicine.belongsToMany(models.Batch, {
        through: models.MedicineStockMovement,
        as: 'poolMovementBatches',
      })
      Medicine.belongsToMany(models.PharmacyPool, {
        through: models.MedicineStockMovement,
        foreignKey: 'pharmacyPoolSourceId',
        as: 'poolMovementSourcePharmacyPools',
      })
      Medicine.belongsToMany(models.PharmacyPool, {
        through: models.MedicineStockMovement,
        foreignKey: 'pharmacyPoolDestinationId',
        as: 'poolMovementDestinationPharmacyPools',
      })
      // Medicine.belongsToMany(models.Batch, {
      //   foreignKey: 'madicineId',
      //   through: models.MedicineBatch,
      //   as: 'batches',
      // })
      // Medicine.hasMany(models.MedicineBatch, {
      //   foreignKey: 'madicineId',
      //   as: 'medicineBatches',
      // })
      //
      Medicine.belongsToMany(models.Medicine, {
        through: models.MedicinePackage,
        foreignKey: 'medicineId',
        as: 'packageComponents',
      })
      Medicine.belongsToMany(models.Medicine, {
        through: models.MedicinePackage,
        foreignKey: 'medicineComponentId',
        as: 'packages',
      })
      Medicine.belongsTo(models.Supplier, {
        foreignKey: 'supplierId',
        as: 'supplier',
      })
      Medicine.hasMany(models.PharmacyProcurementItem, {
        foreignKey: 'medicineId',
        as: 'pharmacyProcurementItems',
      })
    }
  }
  Medicine.init(
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
      barCode: {
        allowNull: true,
        type: DataTypes.STRING,
        field: 'bar_code',
      },
      name: {
        type: DataTypes.STRING,
      },
      // in mg
      mainCompositionMg: {
        allowNull: true,
        type: DataTypes.DECIMAL,
        field: 'main_composition_mg',
      },
      // 1: liquid, 2: tablet
      form: {
        type: DataTypes.INTEGER,
      },
      type: {
        allowNull: true,
        type: DataTypes.STRING,
      },
      className: {
        field: 'class_name',
        allowNull: true,
        type: DataTypes.STRING,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      isConsumable: {
        field: 'is_consumable',
        type: DataTypes.BOOLEAN,
      },
      isSearchable: {
        field: 'is_searchable',
        type: DataTypes.BOOLEAN,
      },
      isGeneric: {
        field: 'is_generic',
        type: DataTypes.BOOLEAN,
      },
      isConcoction: {
        field: 'is_concoction',
        type: DataTypes.BOOLEAN,
      },
      supplierId: {
        field: 'supplier_id',
        allowNull: true,
        type: DataTypes.BIGINT,
        references: {
          model: 'suppliers',
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
      modelName: 'Medicine',
    }
  )
  return Medicine
}
