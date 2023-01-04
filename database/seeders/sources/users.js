const { v4: uuidv4 } = require('uuid')
const bcrypt = require('bcryptjs')
const availableUsers = [
  {
    username: 'faiqul.azmi',
    email: 'heiho.tech@gmail.com',
    password: bcrypt.hashSync('mamumo20', 8),
    phone: '08112392625',
    is_verified: true,
    full_name: 'Faiqul Azmi',
    roles: ['super', 'admin', 'nurse', 'admin'],
  },
  {
    username: 'drg.hanum',
    email: 'drg.hanum@gmail.com',
    password: bcrypt.hashSync('mamumo20', 8),
    phone: '081123926251',
    is_verified: true,
    full_name: 'drg. Nor Cholifah Hanum',
    roles: ['doctor-clinic', 'doctor'],
  },
  {
    username: 'drg.aninda',
    email: 'drg.aninda@gmail.com',
    password: bcrypt.hashSync('mamumo20', 8),
    phone: '081123926252',
    is_verified: true,
    full_name: 'drg. Aninda',
    roles: ['doctor-clinic', 'doctor'],
  },
]

let users = []

for (let i = 0; i < availableUsers.length; i++) {
  users.push({
    guid: uuidv4(),
    ...availableUsers[i],
    created_at: new Date(),
    updated_at: new Date(),
  })
}

module.exports = users
