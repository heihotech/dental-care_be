const { internalRequestHandler } = require('../base')

module.exports = ({ httpTool, addressService }) => {
  const { httpRouter, middleware } = httpTool
  const h = internalRequestHandler({ service: addressService })

  httpRouter.delete('/api/addresses/:addressId', [], h.Delete)
  httpRouter.delete('/api/addresses/:addressId/force', [], h.DeleteForce)
  httpRouter.delete('/api/addresses/:addressId/restore', [], h.Restore)
}
