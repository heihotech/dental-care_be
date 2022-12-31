const { internalRequestHandler } = require('./base')

module.exports = ({ httpTool, patientService }) => {
  const { httpRouter, middleware } = httpTool
  const h = internalRequestHandler({ service: patientService })

  httpRouter.post('/api/patients', [middleware.JWTAuth], h.Create)
}
