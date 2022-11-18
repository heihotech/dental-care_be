'use strict'
const { Model } = require('sequelize')
const { modelInit } = require('../config')
module.exports = (sequelize, DataTypes) => {
  class DoctorClinic extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {}
  }
  DoctorClinic.init(
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
      clinicId: {
        type: DataTypes.BIGINT,
        references: {
          model: 'clinics',
          key: 'id',
        },
        field: 'clinic_id',
      },
      doctorId: {
        type: DataTypes.BIGINT,
        references: {
          model: 'doctors',
          key: 'id',
        },
        field: 'doctor_id',
      },
      // 1 (senin), 2 (selasa), 3 (rabu), 4 (kamis), 5 (jumat), 6 (sabtu), 7 (minggu), 8 (hari libur nasional).
      // [
      //   {
      //     day: {1},
      //     open: {'08:00'},
      //     close: {'11:00'},
      //   },
      // ]
      schedules: {
        type: DataTypes.ARRAY(DataTypes.JSONB),
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
      modelName: 'DoctorClinic',
    }
  )
  return DoctorClinic
}
