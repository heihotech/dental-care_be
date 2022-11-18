const { internalRequestHandler } = require('./base')

module.exports = ({ httpTool, clinicService }) => {
  const { httpRouter, middleware } = httpTool
  const h = internalRequestHandler({ service: clinicService })

  httpRouter.post('/api/clinics', [middleware.JWTAuth], h.Create)
}
