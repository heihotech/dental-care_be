const { v4: uuidv4 } = require('uuid')

const clinics = []

const allClinics = [
  {
    name: 'Klinik Gigi 1',
    code: 'GI1',
  },
  {
    name: 'Klinik Gigi 2',
    code: 'GI2',
  },
]

for (let i = 0; i < allClinics.length; i++) {
  clinics.push({
    guid: uuidv4(),
    created_at: new Date(),
    updated_at: new Date(),
    name: allClinics[i].name,
    code: allClinics[i].code,
  })
}

module.exports = clinics
