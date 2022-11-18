const { internalRequestHandler } = require('../base')

module.exports = ({ httpTool, cityService }) => {
  const { httpRouter, middleware } = httpTool
  const h = internalRequestHandler({ service: cityService })

  httpRouter.post('/api/cities', [], h.Create)
}
