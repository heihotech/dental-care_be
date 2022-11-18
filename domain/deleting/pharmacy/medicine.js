const { internalRequestHandler } = require('../base')

module.exports = ({ httpTool, medicineService }) => {
  const { httpRouter, middleware } = httpTool
  const h = internalRequestHandler({ service: medicineService })

  httpRouter.delete('/api/medicines/:medicineId', [], h.Delete)
  httpRouter.delete('/api/medicines/:medicineId/force', [], h.DeleteForce)
  httpRouter.delete('/api/medicines/:medicineId/restore', [], h.Restore)
}
