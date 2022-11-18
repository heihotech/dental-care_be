module.exports = (service) => {
  require('./role')(service)
  require('./user')(service)
  require('./doctor')(service)
  require('./patient/address')(service)
  require('./patient/insurance')(service)
  require('./profile')(service)
}
