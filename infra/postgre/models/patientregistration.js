'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class PatientRegistration extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  PatientRegistration.init({
    guid: DataTypes.UUID
  }, {
    sequelize,
    modelName: 'PatientRegistration',
  });
  return PatientRegistration;
};