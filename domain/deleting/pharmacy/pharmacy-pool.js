const { internalRequestHandler } = require('../base')

module.exports = ({ httpTool, pharmacyPoolService }) => {
  const { httpRouter, middleware } = httpTool
  const h = internalRequestHandler({ service: pharmacyPoolService })

  httpRouter.delete('/api/pharmacy-pools/:pharmacyPoolId', [], h.Delete)
  httpRouter.delete(
    '/api/pharmacy-pools/:pharmacyPoolId/force',
    [],
    h.DeleteForce
  )
  httpRouter.delete(
    '/api/pharmacy-pools/:pharmacyPoolId/restore',
    [],
    h.Restore
  )
}
