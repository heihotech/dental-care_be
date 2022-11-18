const { internalRequestHandler } = require('../base')

module.exports = ({ httpTool, medicineService }) => {
  const { httpRouter, middleware } = httpTool
  const h = internalRequestHandler({ service: medicineService })

  httpRouter.get('/api/medicines', [middleware.JWTAuth], h.GetAll)
  httpRouter.get('/api/medicines/:medicineId', [middleware.JWTAuth], h.GetOne)
}
