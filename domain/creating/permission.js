const { internalRequestHandler } = require('./base')

module.exports = ({ httpTool, permissionService }) => {
  const { httpRouter, middleware } = httpTool
  const h = internalRequestHandler({ service: permissionService })

  httpRouter.post(
    '/api/permissions',
    [middleware.JWTAuth],
    h.CreateAndInjectActor
  )
}
