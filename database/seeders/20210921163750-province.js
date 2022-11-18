const provinces = require('./sources/provinces.js')
module.exports = {
  up: async (queryInterface, Sequelize) => {
    return await queryInterface.bulkInsert('provinces', provinces)
  },

  down: async (queryInterface, Sequelize) => {
    return await queryInterface.bulkDelete('provinces', null, {})
  },
}
