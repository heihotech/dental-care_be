const profiles = require('./sources/profiles')
module.exports = {
  up: async (queryInterface, Sequelize) => {
    return await queryInterface.bulkInsert('profiles', profiles)
  },

  down: async (queryInterface, Sequelize) => {
    return await queryInterface.bulkDelete('profiles', null, {})
  },
}
