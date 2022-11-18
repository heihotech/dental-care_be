const { internalRequestHandler } = require('./base')

module.exports = ({ httpTool, clinicService }) => {
  const { httpRouter, middleware } = httpTool
  const h = internalRequestHandler({ service: clinicService })

  httpRouter.patch('/api/clinics/:clinicId', [middleware.JWTAuth], h.Update)
}
