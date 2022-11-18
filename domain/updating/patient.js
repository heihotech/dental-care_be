const { internalRequestHandler } = require('./base')

module.exports = ({ httpTool, patientService }) => {
  const { httpRouter, middleware } = httpTool
  const h = internalRequestHandler({ service: patientService })

  httpRouter.patch('/api/patients/:patientId', [], h.Update)
}
