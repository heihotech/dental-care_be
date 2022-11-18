const { internalRequestHandler } = require('./base')

module.exports = ({ httpTool, insuranceService }) => {
  const { httpRouter, middleware } = httpTool
  const h = internalRequestHandler({ service: insuranceService })

  httpRouter.post('/api/insurances', [], h.Create)
}
