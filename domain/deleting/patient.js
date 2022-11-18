const { internalRequestHandler } = require('./base')

module.exports = ({ httpTool, patientService }) => {
  const { httpRouter, middleware } = httpTool
  const h = internalRequestHandler({ service: patientService })

  httpRouter.delete('/api/patients/:patientId', [], h.Delete)
  httpRouter.delete('/api/patients/:patientId/force', [], h.DeleteForce)
  httpRouter.delete('/api/patients/:patientId/restore', [], h.Restore)
}
