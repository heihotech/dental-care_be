'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class MedicineTag extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  MedicineTag.init({
    name: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'MedicineTag',
  });
  return MedicineTag;
};