const { v4: uuidv4 } = require('uuid')
const availableProfiles = [
  {
    full_name: 'Faiqul Azmi',
    gender: 'M',
  },
  {
    full_name: 'drg. Nor Cholifah Hanum',
    gender: 'F',
  },
  {
    full_name: 'drg. Aninda',
    gender: 'F',
  },
]

let profiles = []

for (let i = 0; i < availableProfiles.length; i++) {
  profiles.push({
    guid: uuidv4(),
    ...availableProfiles[i],
    created_at: new Date(),
    updated_at: new Date(),
  })
}

module.exports = profiles
