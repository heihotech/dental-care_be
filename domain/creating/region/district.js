const { internalRequestHandler } = require('../base')

module.exports = ({ httpTool, districtService }) => {
  const { httpRouter, middleware } = httpTool
  const h = internalRequestHandler({ service: districtService })

  httpRouter.post('/api/districts', [], h.Create)
}
