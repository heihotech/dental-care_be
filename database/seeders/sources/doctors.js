const { v4: uuidv4 } = require('uuid')

const doctors = []

const allDoctors = [
  {
    username: 'drg.hanum',
    specialist: 'Dokter Gigi',
    code: 'NCH',
  },
  {
    username: 'drg.aninda',
    specialist: 'Dokter Gigi',
    code: 'AND',
  },
]

for (let i = 0; i < allDoctors.length; i++) {
  doctors.push({
    guid: uuidv4(),
    created_at: new Date(),
    updated_at: new Date(),
    specialist: allDoctors[i].specialist,
    username: allDoctors[i].username,
    code: allDoctors[i].code,
  })
}

module.exports = doctors
