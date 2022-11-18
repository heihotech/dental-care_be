const { internalRequestHandler } = require('./base')

module.exports = ({ httpTool, roleService }) => {
  const { httpRouter, middleware } = httpTool
  const h = internalRequestHandler({ service: roleService })

  httpRouter.delete('/api/roles/:roleId', [middleware.JWTAuth], h.Delete)
  httpRouter.delete(
    '/api/roles/:roleId/force',
    [middleware.JWTAuth],
    h.DeleteForce
  )
  httpRouter.delete(
    '/api/roles/:roleId/restore',
    [middleware.JWTAuth],
    h.Restore
  )
}
