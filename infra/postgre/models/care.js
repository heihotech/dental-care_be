'use strict'
const { Model } = require('sequelize')
const { modelInit } = require('../config')
module.exports = (sequelize, DataTypes) => {
  class Care extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Care.hasMany(models.MedicineRecipe, {
      //   foreignKey: 'careId',
      //   as: 'medicineRecipes',
      // })
    }
  }
  Care.init(
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
      assesmentId: {
        field: 'assesment_id',
        allowNull: true,
        type: DataTypes.BIGINT,
        references: {
          model: 'assesments',
          key: 'id',
        },
      },
      vitalsignId: {
        field: 'vitalsign_id',
        allowNull: true,
        type: DataTypes.BIGINT,
        references: {
          model: 'vitalsigns',
          key: 'id',
        },
      },
      soapId: {
        field: 'soap_id',
        allowNull: true,
        type: DataTypes.BIGINT,
        references: {
          model: 'soaps',
          key: 'id',
        },
      },
      outpatientId: {
        field: 'outpatient_id',
        allowNull: true,
        type: DataTypes.BIGINT,
        references: {
          model: 'outpatients',
          key: 'id',
        },
      },
      outpatientDoctorClinicId: {
        field: 'outpatient_doctor_clinic_id',
        allowNull: true,
        type: DataTypes.BIGINT,
        references: {
          model: 'doctor_clinics',
          key: 'id',
        },
      },
      inpatientId: {
        field: 'inpatient_id',
        allowNull: true,
        type: DataTypes.BIGINT,
        references: {
          model: 'inpatients',
          key: 'id',
        },
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
      modelName: 'Care',
    }
  )
  return Care
}
