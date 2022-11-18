module.exports = (services) => {
  require('./user')(services)
  require('./region/province')(services)
  require('./region/city')(services)
  require('./region/district')(services)
  require('./region/village')(services)
  require('./region/address')(services)
  require('./patient')(services)
  require('./insurance')(services)
  require('./profile')(services)
  require('./role')(services)
  require('./clinic')(services)
  // pharmacy
  require('./pharmacy/medicine')(services)
  require('./pharmacy/pharmacy-pool')(services)
}