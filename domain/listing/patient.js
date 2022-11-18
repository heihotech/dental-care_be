const { internalRequestHandler } = require('./base')

module.exports = ({ httpTool, patientService }) => {
  const { httpRouter, middleware } = httpTool
  const h = internalRequestHandler({ service: patientService })

  httpRouter.get('/api/patients', [], h.GetAll)
  httpRouter.get('/api/patients/:patientId', [], h.GetOne)
}
