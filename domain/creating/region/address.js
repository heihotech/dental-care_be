const { internalRequestHandler } = require('../base')

module.exports = ({ httpTool, addressService }) => {
  const { httpRouter, middleware } = httpTool
  const h = internalRequestHandler({ service: addressService })

  httpRouter.post('/api/addresses', [], h.Create)
}
