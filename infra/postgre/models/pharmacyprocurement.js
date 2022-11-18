'use strict'
const { Model } = require('sequelize')
const { modelInit } = require('../config')
module.exports = (sequelize, DataTypes) => {
  class PharmacyProcurement extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      PharmacyProcurement.belongsTo(models.Supplier, {
        foreignKey: 'supplierId',
        as: 'supplier',
      })
      PharmacyProcurement.belongsTo(models.User, {
        foreignKey: 'creatorId',
        as: 'creator',
      })
      PharmacyProcurement.belongsTo(models.User, {
        foreignKey: 'validatorId',
        as: 'validator',
      })
      PharmacyProcurement.belongsTo(models.State, {
        foreignKey: 'currentStateId',
        as: 'currentState',
      })
      PharmacyProcurement.hasMany(models.PharmacyProcurementLog, {
        foreignKey: 'pharmacyProcurementId',
        as: 'pharmacyProcurementLogs',
      })
      PharmacyProcurement.hasMany(models.PharmacyProcurementItem, {
        foreignKey: 'pharmacyProcurementItemId',
        as: 'pharmacyProcurementItems',
      })
    }
  }
  PharmacyProcurement.init(
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
      handOverNumber: {
        field: 'hand_over_number',
        allowNull: true,
        type: DataTypes.STRING,
      },
      handOverUrl: {
        field: 'hand_over_url',
        allowNull: true,
        type: DataTypes.STRING,
      },
      invoiceNumber: {
        field: 'invoice_number',
        allowNull: true,
        type: DataTypes.STRING,
      },
      invoiceUrl: {
        field: 'invoice_url',
        allowNull: true,
        type: DataTypes.STRING,
      },
      invoiceDate: {
        field: 'invoice_date',
        allowNull: true,
        type: DataTypes.DATEONLY,
      },
      name: {
        allowNull: true,
        type: DataTypes.STRING,
      },
      price: {
        type: DataTypes.DECIMAL,
      },
      totalPrice: {
        field: 'total_price',
        type: DataTypes.DECIMAL,
      },
      tax: {
        type: DataTypes.DECIMAL,
      },
      taxPercentage: {
        field: 'tax_percentage',
        type: DataTypes.DECIMAL,
      },
      finalPrice: {
        field: 'final_price',
        type: DataTypes.DECIMAL,
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
      currentStateId: {
        field: 'current_state_id',
        allowNull: true,
        type: DataTypes.BIGINT,
        references: {
          model: 'states',
          key: 'id',
        },
      },
      creatorId: {
        field: 'creator_id',
        allowNull: true,
        type: DataTypes.BIGINT,
        references: {
          model: 'users',
          key: 'id',
        },
      },
      validatorId: {
        field: 'validator_id',
        allowNull: true,
        type: DataTypes.BIGINT,
        references: {
          model: 'users',
          key: 'id',
        },
      },
      validatedAt: {
        allowNull: false,
        type: DataTypes.DATE,
        field: 'validated_at',
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
      modelName: 'PharmacyProcurement',
    }
  )
  return PharmacyProcurement
}
