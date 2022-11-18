const clinics = require('./sources/clinics')
module.exports = {
  up: async (queryInterface, Sequelize) => {
    return await queryInterface.bulkInsert('clinics', clinics)
  },

  down: async (queryInterface, Sequelize) => {
    return await queryInterface.bulkDelete('clinics', null, {})
  },
}
