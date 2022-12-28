'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class BookOrder extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  BookOrder.init(
    {
      id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.BIGINT,
        autoIncrement: true,
      },
      patientId: {
        field: 'patient_id',
        allowNull: true,
        type: DataTypes.BIGINT,
        references: {
          model: 'patients',
          key: 'id',
        },
      },
      doctorId: {
        field: 'doctor_id',
        allowNull: true,
        type: DataTypes.BIGINT,
        references: {
          model: 'doctors',
          key: 'id',
        },
      },
      clinicId: {
        field: 'clinic_id',
        allowNull: true,
        type: DataTypes.BIGINT,
        references: {
          model: 'clinics',
          key: 'id',
        },
      },
      arrivalPlan: {
        field: 'arrival_plan',
        type: DataTypes.DATEONLY,
        allowNull: true,
      },
      arrivalEstimation: {
        field: 'arrival_estimation',
        type: DataTypes.DATE,
        allowNull: true,
      },
      arrival: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      patientComplaint: {
        field: 'patient_complaint',
        type: DataTypes.TEXT,
        allowNull: true,
      },
      diagnose: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      therapy: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      therapy: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      cost: {
        type: DataTypes.DECIMAL,
        allowNull: true,
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
      modelName: 'BookOrder',
    }
  )
  return BookOrder
}
