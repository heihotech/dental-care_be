'use strict'
const { Model } = require('sequelize')
const { modelInit } = require('../config')
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      User.belongsTo(models.Profile, { foreignKey: 'profileId', as: 'profile' })
      User.belongsToMany(models.Role, {
        through: models.UserRole,
        as: 'roles',
      })
      User.belongsToMany(models.Permission, {
        through: models.UserPermission,
        as: 'permissions',
      })
      User.hasMany(models.Role, {
        foreignKey: 'createdById',
        as: 'createdRoles',
      })
      User.hasMany(models.Role, {
        foreignKey: 'updatedById',
        as: 'updatedRoles',
      })
      User.hasMany(models.Role, {
        foreignKey: 'deletedById',
        as: 'deletedRoles',
      })
      User.hasMany(models.Permission, {
        foreignKey: 'createdById',
        as: 'createdPermissions',
      })
      User.hasMany(models.Permission, {
        foreignKey: 'updatedById',
        as: 'updatedPermissions',
      })
      User.hasMany(models.Permission, {
        foreignKey: 'deletedById',
        as: 'deletedPermissions',
      })
      //
      User.hasMany(models.PharmacyProcurement, {
        foreignKey: 'creatorId',
        as: 'createdProcurements',
      })
      User.hasMany(models.PharmacyProcurement, {
        foreignKey: 'validatorId',
        as: 'validatedProcurements',
      })
      User.hasMany(models.PharmacyProcurementItem, {
        foreignKey: 'creatorId',
        as: 'createdProcurementItems',
      })
      User.hasMany(models.PharmacyProcurementItem, {
        foreignKey: 'validatorId',
        as: 'validatedProcurementItems',
      })
      User.hasMany(models.PharmacyProcurementItem, {
        foreignKey: 'receiverId',
        as: 'receivedProcurementItems',
      })
      User.hasMany(models.MedicineStockMovement, {
        foreignKey: 'creatorId',
        as: 'createdMedicineStockMovements',
      })
      User.hasMany(models.MedicineStockMovement, {
        foreignKey: 'validatorId',
        as: 'validatedMedicineStockMovements',
      })
      User.hasMany(models.MedicineRecipe, {
        foreignKey: 'creatorId',
        as: 'createdMedicineRecipes',
      })
      User.hasMany(models.MedicineRecipe, {
        foreignKey: 'validatorId',
        as: 'validatedMedicineRecipes',
      })
    }
  }
  User.init(
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
      username: {
        type: DataTypes.STRING,
      },
      email: {
        type: DataTypes.STRING,
      },
      password: {
        type: DataTypes.STRING,
      },
      phone: {
        type: DataTypes.STRING,
      },
      smsVerificationCode: {
        type: DataTypes.STRING,
        field: 'sms_verification_code',
      },
      profileId: {
        allowNull: true,
        type: DataTypes.BIGINT,
        references: {
          model: 'profiles',
          key: 'id',
        },
        field: 'profile_id',
      },
      isVerified: {
        type: DataTypes.BOOLEAN,
        default: false,
        field: 'is_verified',
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
      modelName: 'User',
      defaultScope: {
        attributes: { exclude: ['password', 'smsVerificationCode'] },
      },
      scopes: {
        withPassword: {
          attributes: { include: ['password'] },
        },
        withSmsVerificationCode: {
          attributes: { include: ['smsVerificationCode'] },
        },
      },
    }
  )
  return User
}
