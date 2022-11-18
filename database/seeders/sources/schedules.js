const { v4: uuidv4 } = require('uuid')

const schedules = []

const times = ['07.00-13.00', '15.00-21.00']

const addDays = (date, days) => {
  let newDate = {
    guid: null,
    day: null,
    month: null,
    year: null,
    time: null,
    created_at: null,
    updated_at: null,
  }
  date.setDate(date.getDate() + parseInt(days))
  newDate.guid = uuidv4()
  newDate.day = date.getDate()
  newDate.month = date.getMonth() + 1
  newDate.year = date.getFullYear()
  newDate.created_at = new Date()
  newDate.updated_at = new Date()
  return newDate
}

let currentDate = new Date()
for (let i = 0; i < 365; i++) {
  let newDate = addDays(currentDate, 1)
  for (let t = 0; t < times.length; t++) {
    newDate.time = times[t]
    schedules.push({ ...newDate })
  }
}

module.exports = schedules
