const { internalRequestHandler } = require('./base')

module.exports = ({ httpTool, userService }) => {
  const { httpRouter, middleware } = httpTool
  const h = internalRequestHandler({ service: userService })

  httpRouter.patch('/api/users/:userId', [middleware.JWTAuth], h.Update)
}
