'use strict'
const { Model } = require('sequelize')
const { modelInit } = require('../config')
module.exports = (sequelize, DataTypes) => {
  class InpatientBed extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {}
  }
  InpatientBed.init(
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
      code: {
        allowNull: true,
        type: DataTypes.STRING,
      },
      // {1: VIP, 2: Kelas 1, 3: Kelas 2}
      classRight: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: 'class_right',
      },
      inpatientRoomId: {
        type: DataTypes.BIGINT,
        references: {
          model: 'inpatient_rooms',
          key: 'id',
        },
        field: 'inpatient_room_id',
      },
      isShow: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        field: 'is_show',
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
      modelName: 'InpatientBed',
    }
  )
  return InpatientBed
}
