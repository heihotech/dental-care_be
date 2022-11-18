'use strict'
const { Model } = require('sequelize')
const { modelInit } = require('../config')
module.exports = (sequelize, DataTypes) => {
  class Insurance extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Insurance.belongsTo(models.Patient, {
        foreignKey: 'patientId',
        as: 'patient',
      })
    }
  }
  Insurance.init(
    {
      id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.BIGINT,
        autoIncrement: true,
      },
      number: {
        type: DataTypes.STRING,
        unique: true,
      },
      name: {
        type: DataTypes.STRING,
      },
      validUntil: {
        type: DataTypes.DATEONLY,
        allowNull: true,
        field: 'valid_until',
      },
      isLifetime: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        field: 'is_lifetime',
      },
      classRight: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: 'class_right',
      },
      source: {
        type: DataTypes.STRING,
      },
      notes: {
        allowNull: true,
        type: DataTypes.TEXT,
      },
      imageUrl: {
        allowNull: true,
        type: DataTypes.STRING,
        field: 'img_url',
      },
      patientId: {
        type: DataTypes.BIGINT,
        references: {
          model: 'patients',
          key: 'id',
        },
        field: 'patient_id',
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
      modelName: 'Insurance',
    }
  )
  return Insurance
}
