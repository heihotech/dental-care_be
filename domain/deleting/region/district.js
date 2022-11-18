const { internalRequestHandler } = require('../base')

module.exports = ({ httpTool, districtService }) => {
  const { httpRouter, middleware } = httpTool
  const h = internalRequestHandler({ service: districtService })

  httpRouter.delete('/api/districts/:districtId', [], h.Delete)
  httpRouter.delete('/api/districts/:districtId/force', [], h.DeleteForce)
  httpRouter.delete('/api/districts/:districtId/restore', [], h.Restore)
}
