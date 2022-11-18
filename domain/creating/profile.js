const { internalRequestHandler } = require('./base')

module.exports = ({ httpTool, profileService }) => {
  const { httpRouter, middleware } = httpTool
  const h = internalRequestHandler({ service: profileService })

  httpRouter.post('/api/profiles', [middleware.JWTAuth], h.Create)
}
