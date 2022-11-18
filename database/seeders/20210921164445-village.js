const villages = require('./sources/villages.js')
module.exports = {
  up: async (queryInterface, Sequelize) => {
    return await queryInterface.bulkInsert('villages', villages)
  },

  down: async (queryInterface, Sequelize) => {
    return await queryInterface.bulkDelete('villages', null, {})
  },
}
