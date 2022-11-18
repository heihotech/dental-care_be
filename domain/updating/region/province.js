const { internalRequestHandler } = require('../base')

module.exports = ({ httpTool, provinceService }) => {
  const { httpRouter, middleware } = httpTool
  const h = internalRequestHandler({ service: provinceService })

  httpRouter.patch('/api/provinces/:provinceId', [], h.Update)
}
