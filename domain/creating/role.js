const { internalRequestHandler } = require('./base')

module.exports = ({ httpTool, roleService }) => {
  const { httpRouter, middleware } = httpTool
  const h = internalRequestHandler({ service: roleService })

  httpRouter.post('/api/roles', [middleware.JWTAuth], h.CreateAndInjectActor)
}
