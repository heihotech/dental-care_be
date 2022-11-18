const { internalRequestHandler } = require('../base')
const { ResponseUtil } = require('../../../internal/utils')

module.exports = ({ httpTool, batchService }) => {
  const { httpRouter, middleware } = httpTool
  const m = internalRequestHandler({ service: batchService })

  httpRouter.post('/api/batches', [middleware.JWTAuth], m.Create)
}
