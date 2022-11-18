const { internalRequestHandler } = require('../base')

module.exports = ({ httpTool, cityService }) => {
  const { httpRouter, middleware } = httpTool
  const h = internalRequestHandler({ service: cityService })

  httpRouter.delete('/api/cities/:cityId', [], h.Delete)
  httpRouter.delete('/api/cities/:cityId/force', [], h.DeleteForce)
  httpRouter.delete('/api/cities/:cityId/restore', [], h.Restore)
}
