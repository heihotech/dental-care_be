'use strict'
const { Model } = require('sequelize')
const { modelInit } = require('../config')
module.exports = (sequelize, DataTypes) => {
  class MedicineRecipe extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      MedicineRecipe.belongsTo(models.State, {
        foreignKey: 'currentStateId',
        as: 'state',
      })
      MedicineRecipe.belongsTo(models.User, {
        foreignKey: 'creatorId',
        as: 'creator',
      })
      MedicineRecipe.belongsTo(models.User, {
        foreignKey: 'validatorId',
        as: 'validator',
      })
      // MedicineRecipe.belongsTo(models.Care, {
      //   foreignKey: 'careId',
      //   as: 'care',
      // })
      MedicineRecipe.belongsTo(models.User, {
        foreignKey: 'buyerId',
        as: 'buyer',
      })
      MedicineRecipe.belongsTo(models.Medicine, {
        foreignKey: 'medicineId',
        as: 'medicine',
      })
    }
  }
  MedicineRecipe.init(
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
      currentStateId: {
        field: 'current_state_id',
        allowNull: true,
        type: DataTypes.BIGINT,
        references: {
          model: 'states',
          key: 'id',
        },
      },
      careId: {
        field: 'care_id',
        allowNull: true,
        type: DataTypes.BIGINT,
        references: {
          model: 'cares',
          key: 'id',
        },
      },
      buyerId: {
        field: 'buyer_id',
        allowNull: true,
        type: DataTypes.BIGINT,
        references: {
          model: 'users',
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
      customMedicine: {
        field: 'custom_medicine',
        allowNull: true,
        type: DataTypes.STRING,
      },
      specialInstruction: {
        field: 'special_instruction',
        allowNull: true,
        type: DataTypes.TEXT,
      },
      instructionForUse: {
        field: 'instruction_for_use',
        allowNull: true,
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
      customCompositionMg: {
        field: 'custom_composition_mg',
        allowNull: true,
        type: DataTypes.DECIMAL,
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
      modelName: 'MedicineRecipe',
    }
  )
  return MedicineRecipe
}
