const { internalRequestHandler } = require('../base')

module.exports = ({ httpTool, cityService }) => {
  const { httpRouter, middleware } = httpTool
  const h = internalRequestHandler({ service: cityService })

  httpRouter.get('/api/cities', [], h.GetAll)
  httpRouter.get('/api/cities/:cityId', [], h.GetOne)
}
