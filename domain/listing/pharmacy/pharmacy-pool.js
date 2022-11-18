const { internalRequestHandler } = require('../base')

module.exports = ({ httpTool, pharmacyPoolService }) => {
  const { httpRouter, middleware } = httpTool
  const h = internalRequestHandler({ service: pharmacyPoolService })

  httpRouter.get('/api/pharmacy-pools', [middleware.JWTAuth], h.GetAll)
  httpRouter.get(
    '/api/pharmacy-pools/:pharmacyPoolId',
    [middleware.JWTAuth],
    h.GetOne
  )
}
