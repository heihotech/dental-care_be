'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class NursingCareDiagnosis extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  NursingCareDiagnosis.init({
    name: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'NursingCareDiagnosis',
  });
  return NursingCareDiagnosis;
};