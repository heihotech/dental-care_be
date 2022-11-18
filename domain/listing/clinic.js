const { internalRequestHandler } = require('./base')

module.exports = ({ httpTool, clinicService }) => {
  const { httpRouter, middleware } = httpTool
  const h = internalRequestHandler({ service: clinicService })

  httpRouter.get('/api/clinics', [], h.GetAll)
  httpRouter.get('/api/clinics/:clinicId', [], h.GetOne)
}
