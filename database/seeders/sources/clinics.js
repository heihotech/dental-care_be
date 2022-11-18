const { v4: uuidv4 } = require('uuid')

const clinics = []

const allClinics = [
  {
    name: 'Poli Dalam 1',
    code: 'DA1',
  },
  {
    name: 'Poli Dalam 2',
    code: 'DA2',
  },
  {
    name: 'Poli Umum',
    code: 'UMU',
  },
  {
    name: 'Poli Gigi',
    code: 'GIG',
  },
  {
    name: 'Poli Mata',
    code: 'MAT',
  },
  {
    name: 'Poli Anak',
    code: 'ANA',
  },
  {
    name: 'Poli Paru',
    code: 'PAR',
  },
  {
    name: 'Poli Dots',
    code: 'DOT',
  },
  {
    name: 'Poli Bedah',
    code: 'BED',
  },
  {
    name: 'Poli Saraf',
    code: 'SAR',
  },
  {
    name: 'Poli Orthopedi',
    code: 'ORT',
  },
  {
    name: 'Poli VIP',
    code: 'VIP',
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
