'use strict'
const { Model } = require('sequelize')
const { modelInit } = require('../config')
module.exports = (sequelize, DataTypes) => {
  class PharmacyProcurementItem extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      PharmacyProcurementItem.belongsTo(models.Supplier, {
        foreignKey: 'supplierId',
        as: 'supplier',
      })
      PharmacyProcurementItem.belongsTo(models.State, {
        foreignKey: 'currentStateId',
        as: 'state',
      })
      PharmacyProcurementItem.belongsTo(models.User, {
        foreignKey: 'creatorId',
        as: 'creator',
      })
      PharmacyProcurementItem.belongsTo(models.User, {
        foreignKey: 'validatorId',
        as: 'validator',
      })
      PharmacyProcurementItem.belongsTo(models.User, {
        foreignKey: 'receiverId',
        as: 'receiver',
      })
      PharmacyProcurementItem.belongsTo(models.Batch, {
        foreignKey: 'batchId',
        as: 'batch',
      })
      PharmacyProcurementItem.belongsTo(models.Medicine, {
        foreignKey: 'medicineId',
        as: 'medicine',
      })
      PharmacyProcurementItem.hasMany(models.PharmacyProcurementLog, {
        foreignKey: 'pharmacyProcurementItemId',
        as: 'pharmacyProcurementItemlogs',
      })
      PharmacyProcurementItem.belongsTo(models.PharmacyProcurement, {
        foreignKey: 'pharmacyProcurementId',
        as: 'pharmacyProcurementItem',
      })
    }
  }
  PharmacyProcurementItem.init(
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
      invoiceNumber: {
        allowNull: true,
        field: 'invoice_number',
        type: DataTypes.STRING,
      },
      invoiceDate: {
        field: 'invoice_date',
        allowNull: true,
        type: DataTypes.DATEONLY,
      },
      invoiceUrl: {
        field: 'invoice_url',
        allowNull: true,
        type: DataTypes.STRING,
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
      salesName: {
        field: 'sales_name',
        allowNull: true,
        type: DataTypes.STRING,
      },
      batchId: {
        field: 'batch_id',
        allowNull: true,
        type: DataTypes.BIGINT,
        references: {
          model: 'batches',
          key: 'id',
        },
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
      supplierId: {
        field: 'supplier_id',
        allowNull: true,
        type: DataTypes.BIGINT,
        references: {
          model: 'suppliers',
          key: 'id',
        },
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
      currentStateId: {
        field: 'current_state_id',
        allowNull: true,
        type: DataTypes.BIGINT,
        references: {
          model: 'states',
          key: 'id',
        },
      },
      quantity: {
        type: DataTypes.DECIMAL,
      },
      uom: {
        type: DataTypes.STRING,
      },
      quantityReceived: {
        field: 'quantity_received',
        allowNull: true,
        type: DataTypes.DECIMAL,
      },
      quantityReturned: {
        field: 'quantity_returned',
        allowNull: true,
        type: DataTypes.DECIMAL,
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
      receiverId: {
        field: 'receiver_id',
        allowNull: true,
        type: DataTypes.BIGINT,
        references: {
          model: 'users',
          key: 'id',
        },
      },
      expiredAt: {
        allowNull: false,
        type: DataTypes.DATEONLY,
        field: 'expired_at',
      },
      receivedAt: {
        allowNull: false,
        type: DataTypes.DATEONLY,
        field: 'received_at',
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
      modelName: 'PharmacyProcurementItem',
    }
  )
  return PharmacyProcurementItem
}
