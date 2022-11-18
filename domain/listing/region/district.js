const { internalRequestHandler } = require('../base')

module.exports = ({ httpTool, districtService }) => {
  const { httpRouter, middleware } = httpTool
  const h = internalRequestHandler({ service: districtService })

  httpRouter.get('/api/districts', [], h.GetAll)
  httpRouter.get('/api/districts/:districtId', [], h.GetOne)
}
