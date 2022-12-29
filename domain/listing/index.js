module.exports = (services) => {
  require('./user')(services)
  require('./profile')(services)
  require('./role')(services)
  require('./doctor')(services)
  require('./clinic')(services)
  require('./schedule')(services)
  require('./region/province')(services)
  require('./region/city')(services)
  require('./region/district')(services)
  require('./region/village')(services)
  require('./region/address')(services)
  require('./patient')(services)
}
