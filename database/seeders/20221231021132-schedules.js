const { v4: uuidv4 } = require('uuid')
const schedules = require('./sources/schedules')
module.exports = {
  up: async (queryInterface, Sequelize) => {
    let payload = []
    for (const el of schedules) {
      const doctor = await queryInterface.rawSelect(
        'doctors',
        {
          where: {
            code: el.code,
          },
        },
        ['id']
      )

      if (doctor) {
        delete el.code
        payload.push({
          guid: el.guid,
          doctor_id: doctor,
          day: el.schedule.day,
          time: el.schedule.time,
          created_at: el.created_at,
          updated_at: el.updated_at,
        })
      }
    }

    return await queryInterface.bulkInsert('schedules', payload)
  },

  down: async (queryInterface, Sequelize) => {
    return await queryInterface.bulkDelete('schedules', null, {})
  },
}
