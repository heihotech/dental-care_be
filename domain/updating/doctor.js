const { internalRequestHandler } = require('./base')

module.exports = ({ httpTool, doctorService }) => {
  const { httpRouter, middleware } = httpTool
  const h = internalRequestHandler({ service: doctorService })

  httpRouter.patch('/api/doctors/:doctorId', [middleware.JWTAuth], h.Update)
}
