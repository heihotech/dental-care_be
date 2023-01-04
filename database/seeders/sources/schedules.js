const { v4: uuidv4 } = require('uuid')

const schedules = []

const allSchedules = [
  {
    code: 'NCH',
    schedules: [
      { day: 1, time: '06.00 - 07:00' },
      { day: 2, time: '06.00 - 07:00' },
      { day: 3, time: '06.00 - 07:00' },
      { day: 4, time: '06.00 - 07:00' },
      { day: 5, time: '06.00 - 07:00' },
      { day: 6, time: '06.00 - 07:00' },
      { day: 1, time: '16.00 - 20:00' },
      { day: 2, time: '16.00 - 20:00' },
      { day: 3, time: '16.00 - 20:00' },
      { day: 4, time: '16.00 - 20:00' },
      { day: 5, time: '16.00 - 20:00' },
      { day: 6, time: '16.00 - 20:00' },
    ],
  },
  {
    code: 'AND',
    schedules: [
      { day: 2, time: '16.00 - 20:00' },
      { day: 4, time: '16.00 - 20:00' },
    ],
  },
]

for (let i = 0; i < allSchedules.length; i++) {
  allSchedules[i].schedules.map((el) => {
    schedules.push({
      guid: uuidv4(),
      created_at: new Date(),
      updated_at: new Date(),
      code: allSchedules[i].code,
      schedule: el,
    })
  })
}

module.exports = schedules
