const { internalRequestHandler } = require('./base')

module.exports = ({ httpTool, roleService }) => {
  const { httpRouter, middleware } = httpTool
  const h = internalRequestHandler({ service: roleService })

  httpRouter.patch('/api/roles/:roleId', [middleware.JWTAuth], h.Update)
}
