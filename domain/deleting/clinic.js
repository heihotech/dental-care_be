const { internalRequestHandler } = require('./base')

module.exports = ({ httpTool, clinicService }) => {
  const { httpRouter, middleware } = httpTool
  const h = internalRequestHandler({ service: clinicService })

  httpRouter.delete('/api/clinics/:clinicId', [middleware.JWTAuth], h.Delete)
  httpRouter.delete(
    '/api/clinics/:clinicId/force',
    [middleware.JWTAuth],
    h.DeleteForce
  )
  httpRouter.delete(
    '/api/clinics/:clinicId/restore',
    [middleware.JWTAuth],
    h.Restore
  )
}
