const { internalRequestHandler } = require('./base')

module.exports = ({ httpTool, profileService }) => {
  const { httpRouter, middleware } = httpTool
  const h = internalRequestHandler({ service: profileService })

  httpRouter.get('/api/profiles', [], h.GetAll)
  httpRouter.get('/api/profiles/:profileId', [], h.GetOne)
}
