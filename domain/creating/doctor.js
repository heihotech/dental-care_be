const { internalRequestHandler } = require('./base')

module.exports = ({ httpTool, doctorService }) => {
  const { httpRouter, middleware } = httpTool
  const h = internalRequestHandler({ service: doctorService })

  httpRouter.post('/api/doctors', [middleware.JWTAuth], h.Create)
}
