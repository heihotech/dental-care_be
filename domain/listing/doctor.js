const { internalRequestHandler } = require('./base')

module.exports = ({ httpTool, doctorService }) => {
  const { httpRouter, middleware } = httpTool
  const h = internalRequestHandler({ service: doctorService })

  httpRouter.get('/api/doctors', [], h.GetAll)
  httpRouter.get('/api/doctors/:doctorId', [], h.GetOne)
}
