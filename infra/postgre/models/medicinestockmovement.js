'use strict'
const { Model } = require('sequelize')
const { modelInit } = require('../config')
module.exports = (sequelize, DataTypes) => {
  class MedicineStockMovement extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      MedicineStockMovement.belongsTo(models.State, {
        foreignKey: 'currentStateId',
        as: 'state',
      })
      MedicineStockMovement.belongsTo(models.User, {
        foreignKey: 'creatorId',
        as: 'creator',
      })
      MedicineStockMovement.belongsTo(models.User, {
        foreignKey: 'validatorId',
        as: 'validator',
      })
    }
  }
  MedicineStockMovement.init(
    {
      id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.BIGINT,
        autoIncrement: true,
      },
      currentStateId: {
        field: 'current_state_id',
        type: DataTypes.BIGINT,
        references: {
          model: 'states',
          key: 'id',
        },
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
      pharmacyPoolSourceId: {
        type: DataTypes.BIGINT,
        references: {
          model: 'pharmacy_pools',
          key: 'id',
        },
        field: 'pharmacy_pool_source_id',
      },
      pharmacyPoolDestinationId: {
        allowNull: true,
        type: DataTypes.BIGINT,
        references: {
          model: 'pharmacy_pools',
          key: 'id',
        },
        field: 'pharmacy_pool_destination_id',
      },
      medicineRecipeId: {
        allowNull: true,
        type: DataTypes.BIGINT,
        references: {
          model: 'medicine_recipes',
          key: 'id',
        },
        field: 'medicine_recipe_id',
      },
      // 1: income, 2: outcome, 3: recipe
      type: {
        type: DataTypes.INTEGER,
      },
      quantity: {
        allowNull: true,
        type: DataTypes.DECIMAL,
      },
      uom: {
        allowNull: true,
        type: DataTypes.STRING,
      },
      // source
      creatorId: {
        field: 'creator_id',
        allowNull: true,
        type: DataTypes.BIGINT,
        references: {
          model: 'users',
          key: 'id',
        },
      },
      // destination
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
        allowNull: true,
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
      modelName: 'MedicineStockMovement',
    }
  )
  return MedicineStockMovement
}
