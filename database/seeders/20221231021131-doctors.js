const { v4: uuidv4 } = require('uuid')
const doctors = require('./sources/doctors')
module.exports = {
  up: async (queryInterface, Sequelize) => {
    let payload = []
    for (const el of doctors) {
      const user = await queryInterface.rawSelect(
        'users',
        {
          where: {
            username: el.username,
          },
        },
        ['id']
      )

      if (user) {
        delete el.username
        payload.push({
          ...el,
          user_id: user,
        })
      }
    }

    return await queryInterface.bulkInsert('doctors', payload)
  },

  down: async (queryInterface, Sequelize) => {
    return await queryInterface.bulkDelete('doctors', null, {})
  },
}
