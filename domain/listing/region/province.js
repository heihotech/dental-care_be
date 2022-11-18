const { internalRequestHandler } = require('../base')

module.exports = ({ httpTool, provinceService }) => {
  const { httpRouter, middleware } = httpTool
  const h = internalRequestHandler({ service: provinceService })

  httpRouter.get('/api/provinces', [], h.GetAll)
  httpRouter.get('/api/provinces/:provinceId', [], h.GetOne)
}
