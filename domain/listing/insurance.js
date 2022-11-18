const { internalRequestHandler } = require('./base')

module.exports = ({ httpTool, insuranceService }) => {
  const { httpRouter, middleware } = httpTool
  const h = internalRequestHandler({ service: insuranceService })

  httpRouter.get('/api/insurances', [], h.GetAll)
  httpRouter.get('/api/insurances/:insuranceId', [], h.GetOne)
}
