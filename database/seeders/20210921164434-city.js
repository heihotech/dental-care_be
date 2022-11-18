const cities = require('./sources/cities.js')
module.exports = {
  up: async (queryInterface, Sequelize) => {
    return await queryInterface.bulkInsert('cities', cities)
  },

  down: async (queryInterface, Sequelize) => {
    return await queryInterface.bulkDelete('cities', null, {})
  },
}
