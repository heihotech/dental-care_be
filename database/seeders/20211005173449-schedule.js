const schedules = require('./sources/schedules')
module.exports = {
  up: async (queryInterface, Sequelize) => {
    // return await queryInterface.bulkInsert('schedules', schedules)
    return {}
  },

  down: async (queryInterface, Sequelize) => {
    return await queryInterface.bulkDelete('schedules', null, {})
  },
}
