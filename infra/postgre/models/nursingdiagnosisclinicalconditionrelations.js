'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class NursingDiagnosisClinicalConditionRelations extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  NursingDiagnosisClinicalConditionRelations.init({
    name: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'NursingDiagnosisClinicalConditionRelations',
  });
  return NursingDiagnosisClinicalConditionRelations;
};