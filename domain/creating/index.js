module.exports = (services) => {
  // require('./master')(services)
  require('./user')(services)
  require('./role')(services)
  require('./permission')(services)
  require('./profile')(services)
  require('./doctor')(services)
  require('./clinic')(services)
  require('./schedule')(services)
  require('./region/province')(services)
  require('./region/city')(services)
  require('./region/district')(services)
  require('./region/village')(services)
  require('./region/address')(services)
  require('./patient')(services)
  require('./insurance')(services)
  require('./outpatient')(services)
  require('./doc-templater/category')(services)
  require('./doc-templater/document')(services)
  // pharmacy
  require('./pharmacy/medicine')(services)
  require('./pharmacy/pharmacy-pool')(services)
  require('./pharmacy/batch')(services)
}