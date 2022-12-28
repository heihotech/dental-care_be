const { v4: uuidv4 } = require('uuid')
const availableRoles = [
  {
    name: 'super',
    display: 'Super',
    level: 0,
  },
  {
    name: 'admin',
    display: 'Admin',
    level: 1,
  },
  {
    name: 'doctor',
    display: 'Dokter',
    level: null,
  },
  {
    name: 'nurse',
    display: 'Perawat',
    level: null,
  },
  {
    name: 'user',
    display: 'Pengguna',
    level: 99,
  },
]

let roles = []

for (let i = 0; i < availableRoles.length; i++) {
  roles.push({
    id: i + 1,
    guid: uuidv4(),
    ...availableRoles[i],
    created_at: new Date(),
    updated_at: new Date(),
  })
}

module.exports = roles
