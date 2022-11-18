'use strict'
const { Model } = require('sequelize')
const { modelInit } = require('../config')
module.exports = (sequelize, DataTypes) => {
  class ProfileRelation extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  ProfileRelation.init(
    {
      id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.BIGINT,
        autoIncrement: true,
      },
      profileId: {
        type: DataTypes.BIGINT,
        references: {
          model: 'profiles',
          key: 'id',
        },
        field: 'profile_id',
      },
      relatedProfileId: {
        type: DataTypes.BIGINT,
        references: {
          model: 'profiles',
          key: 'id',
        },
        field: 'related_profile_id',
      },
      relationType: {
        allowNull: false,
        type: DataTypes.STRING,
        field: 'relation_type',
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
      modelName: 'ProfileRelation',
    }
  )
  return ProfileRelation
}
