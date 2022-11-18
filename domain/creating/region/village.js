const { internalRequestHandler } = require('../base')

module.exports = ({ httpTool, villageService }) => {
  const { httpRouter, middleware } = httpTool
  const h = internalRequestHandler({ service: villageService })

  httpRouter.post('/api/villages', [], h.Create)
}
