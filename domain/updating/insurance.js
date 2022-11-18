const { internalRequestHandler } = require('./base')

module.exports = ({ httpTool, insuranceService }) => {
  const { httpRouter, middleware } = httpTool
  const h = internalRequestHandler({ service: insuranceService })

  httpRouter.patch('/api/insurances/:insuranceId', [], h.Update)
}
