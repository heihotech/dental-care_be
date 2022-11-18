const { internalRequestHandler } = require('../base')

module.exports = ({ httpTool, districtService }) => {
  const { httpRouter, middleware } = httpTool
  const h = internalRequestHandler({ service: districtService })

  httpRouter.patch('/api/districts/:districtId', [], h.Update)
}
