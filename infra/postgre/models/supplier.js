'use strict'
const { Model } = require('sequelize')
const { modelInit } = require('../config')
module.exports = (sequelize, DataTypes) => {
  class Supplier extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Supplier.hasMany(models.Medicine, {
        foreignKey: 'supplierId',
        as: 'medicines',
      })
      Supplier.belongsTo(models.Address, {
        foreignKey: 'addressId',
        as: 'address',
      })
      Supplier.hasMany(models.PharmacyProcurement, {
        foreignKey: 'supplierId',
        as: 'procurements',
      })
    }
  }
  Supplier.init(
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
      companyType: {
        field: 'company_type',
        type: DataTypes.STRING,
      },
      addressId: {
        field: 'address_id',
        allowNull: true,
        type: DataTypes.BIGINT,
        references: {
          model: 'addresses',
          key: 'id',
        },
      },
      isBlacklisted: {
        field: 'is_blacklisted',
        type: DataTypes.BOOLEAN,
      },
      addressedTo: {
        field: 'addressed_to',
        allowNull: true,
        type: DataTypes.STRING,
      },
      position: {
        allowNull: true,
        type: DataTypes.STRING,
      },
      taxNumber: {
        field: 'tax_number',
        allowNull: true,
        type: DataTypes.STRING,
      },
      bankName: {
        field: 'bank_name',
        allowNull: true,
        type: DataTypes.STRING,
      },
      bankAccountNumber: {
        field: 'bank_account_number',
        allowNull: true,
        type: DataTypes.STRING,
      },
      bankAccountName: {
        field: 'bank_account_name',
        allowNull: true,
        type: DataTypes.STRING,
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
      modelName: 'Supplier',
    }
  )
  return Supplier
}
