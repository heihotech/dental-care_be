const { internalRequestHandler } = require('../base')

module.exports = ({ httpTool, villageService }) => {
  const { httpRouter, middleware } = httpTool
  const h = internalRequestHandler({ service: villageService })

  httpRouter.patch('/api/villages/:villageId', [], h.Update)
}
