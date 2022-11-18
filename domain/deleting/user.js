const { internalRequestHandler } = require('./base')

module.exports = ({ httpTool, userService }) => {
  const { httpRouter, middleware } = httpTool
  const h = internalRequestHandler({ service: userService })

  httpRouter.delete('/api/users/:userId', [middleware.JWTAuth], h.Delete)
  httpRouter.delete(
    '/api/users/:userId/force',
    [middleware.JWTAuth],
    h.DeleteForce
  )
  httpRouter.delete(
    '/api/users/:userId/restore',
    [middleware.JWTAuth],
    h.Restore
  )
}
