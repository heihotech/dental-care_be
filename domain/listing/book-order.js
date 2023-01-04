const { internalRequestHandler } = require('./base')

module.exports = ({ httpTool, bookOrderService }) => {
  const { httpRouter, middleware } = httpTool
  const h = internalRequestHandler({ service: bookOrderService })

  httpRouter.get('/api/book-orders', [], h.GetAll)
  httpRouter.get('/api/book-orders/:bookOrderId', [], h.GetOne)
}
