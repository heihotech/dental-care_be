const { internalRequestHandler } = require('./base')

module.exports = ({ httpTool, roleService }) => {
  const { httpRouter, middleware } = httpTool
  const h = internalRequestHandler({ service: roleService })

  httpRouter.get('/api/roles', [middleware.JWTAuth], h.GetAll)
  httpRouter.get('/api/roles/:roleId', [middleware.JWTAuth], h.GetOne)
}
