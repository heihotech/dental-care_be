const { internalRequestHandler } = require('./base')

module.exports = ({ httpTool, bookOrderService }) => {
  const { httpRouter, middleware } = httpTool
  const h = internalRequestHandler({ service: bookOrderService })

  httpRouter.delete(
    '/api/book-orders/:bookOrderId',
    [middleware.JWTAuth],
    h.Delete
  )
  httpRouter.delete(
    '/api/book-orders/:bookOrderId/force',
    [middleware.JWTAuth],
    h.DeleteForce
  )
  httpRouter.delete(
    '/api/book-orders/:bookOrderId/restore',
    [middleware.JWTAuth],
    h.Restore
  )
}
