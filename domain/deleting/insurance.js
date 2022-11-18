const { internalRequestHandler } = require('./base')

module.exports = ({ httpTool, insuranceService }) => {
  const { httpRouter, middleware } = httpTool
  const h = internalRequestHandler({ service: insuranceService })

  httpRouter.delete('/api/insurances/:insuranceId', [], h.Delete)
  httpRouter.delete('/api/insurances/:insuranceId/force', [], h.DeleteForce)
  httpRouter.delete('/api/insurances/:insuranceId/restore', [], h.Restore)
}
