const { internalRequestHandler } = require('../base')

module.exports = ({ httpTool, villageService }) => {
  const { httpRouter, middleware } = httpTool
  const h = internalRequestHandler({ service: villageService })

  httpRouter.delete('/api/villages/:villageId', [], h.Delete)
  httpRouter.delete('/api/villages/:villageId/force', [], h.DeleteForce)
  httpRouter.delete('/api/villages/:villageId/restore', [], h.Restore)
}
