const districts = require('./sources/districts.js')
module.exports = {
  up: async (queryInterface, Sequelize) => {
    return await queryInterface.bulkInsert('districts', districts)
  },

  down: async (queryInterface, Sequelize) => {
    return await queryInterface.bulkDelete('districts', null, {})
  },
}
