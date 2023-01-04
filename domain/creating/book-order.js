const { internalRequestHandler } = require('./base')

module.exports = ({ httpTool, bookOrderService }) => {
  const { httpRouter, middleware } = httpTool
  const h = internalRequestHandler({ service: bookOrderService })

  httpRouter.post('/api/book-orders', [middleware.JWTAuth], h.Create)
}
