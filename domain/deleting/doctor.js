const { internalRequestHandler } = require('./base')

module.exports = ({ httpTool, doctorService }) => {
  const { httpRouter, middleware } = httpTool
  const h = internalRequestHandler({ service: doctorService })

  httpRouter.delete('/api/doctors/:doctorId', [middleware.JWTAuth], h.Delete)
  httpRouter.delete(
    '/api/doctors/:doctorId/force',
    [middleware.JWTAuth],
    h.DeleteForce
  )
  httpRouter.delete(
    '/api/doctors/:doctorId/restore',
    [middleware.JWTAuth],
    h.Restore
  )
}
