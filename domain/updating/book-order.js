const { internalRequestHandler } = require('./base')

module.exports = ({ httpTool, bookOrderService }) => {
  const { httpRouter, middleware } = httpTool
  const h = internalRequestHandler({ service: bookOrderService })

  httpRouter.patch(
    '/api/book-orders/:bookOrderId',
    [middleware.JWTAuth],
    h.Update
  )
}
