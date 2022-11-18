const { internalRequestHandler } = require('../base')

module.exports = ({ httpTool, addressService }) => {
  const { httpRouter, middleware } = httpTool
  const h = internalRequestHandler({ service: addressService })

  httpRouter.patch('/api/addresses/:addressId', [], h.Update)
}
