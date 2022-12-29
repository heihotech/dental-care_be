module.exports = (services) => {
  require('./user')(services)
  require('./role')(services)
  require('./region/province')(services)
  require('./region/city')(services)
  require('./region/district')(services)
  require('./region/village')(services)
  require('./region/address')(services)
  require('./patient')(services)
  require('./clinic')(services)
  require('./doctor')(services)
}
