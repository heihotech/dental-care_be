'use strict'
const { Model } = require('sequelize')
const { modelInit } = require('../config')
module.exports = (sequelize, DataTypes) => {
  class Outpatient extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Outpatient.belongsTo(models.Patient, {
        foreignKey: 'patientId',
        as: 'patient',
      })
      Outpatient.belongsTo(models.DoctorClinic, {
        foreignKey: 'doctorClinicId',
        as: 'doctorClinic',
      })
    }
  }
  Outpatient.init(
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
      // {1 (UMUM), 2 (BPJS PBI), 3 (BPJS NON PBI)}
      patientType: {
        type: DataTypes.INTEGER,
        field: 'patient_type',
      },
      registrationBookingCode: {
        type: DataTypes.STRING,
        unique: true,
        field: 'registration_booking_code',
      },
      registrationNumber: {
        type: DataTypes.STRING,
        unique: true,
        field: 'registration_number',
      },
      patientId: {
        type: DataTypes.BIGINT,
        references: {
          model: 'patients',
          key: 'id',
        },
        field: 'patient_id',
      },
      doctorClinicId: {
        type: DataTypes.BIGINT,
        references: {
          model: 'doctor_clinics',
          key: 'id',
        },
        field: 'doctor_clinic_id',
      },
      // {1 (Rujukan FKTP), 2 (Rujukan Internal), 3 (Kontrol), 4 (Rujukan Antar RS)}
      visitType: {
        type: DataTypes.INTEGER,
        field: 'visit_type',
      },
      referenceNumber: {
        allowNull: true,
        type: DataTypes.STRING,
        field: 'reference_number',
      },
      visitTimeReference: {
        allowNull: true,
        type: DataTypes.DATE,
        field: 'visit_time_reference',
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
      modelName: 'Outpatient',
    }
  )
  return Outpatient
}
