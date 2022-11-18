// const baseHandler = require('../base')
const { internalRequestHandler } = require('../base')

module.exports = ({ httpTool, addressService }) => {
  const { httpRouter, middleware } = httpTool
  const h = internalRequestHandler({ service: addressService })

  httpRouter.get('/api/addresses', [], h.GetAll)
  httpRouter.get('/api/addresses/:addressId', [], h.GetOne)
}
