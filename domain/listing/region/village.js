const { internalRequestHandler } = require('../base')

module.exports = ({ httpTool, villageService }) => {
  const { httpRouter, middleware } = httpTool
  const h = internalRequestHandler({ service: villageService })

  httpRouter.get('/api/villages', [], h.GetAll)
  httpRouter.get('/api/villages/:villageId', [], h.GetOne)
}
