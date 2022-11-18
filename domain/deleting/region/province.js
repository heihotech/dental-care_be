const { internalRequestHandler } = require('../base')

module.exports = ({ httpTool, provinceService }) => {
  const { httpRouter, middleware } = httpTool
  const h = internalRequestHandler({ service: provinceService })

  httpRouter.delete('/api/provinces/:provinceId', [], h.Delete)
  httpRouter.delete('/api/provinces/:provinceId/force', [], h.DeleteForce)
  httpRouter.delete('/api/provinces/:provinceId/restore', [], h.Restore)
}
