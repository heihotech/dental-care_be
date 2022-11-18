const { internalRequestHandler } = require('./base')

module.exports = ({ httpTool, profileService }) => {
  const { httpRouter, middleware } = httpTool
  const h = internalRequestHandler({ service: profileService })

  httpRouter.patch('/api/profiles/:profileId', [middleware.JWTAuth], h.Update)
}
