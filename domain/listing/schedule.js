const { internalRequestHandler } = require('./base')

module.exports = ({ httpTool, scheduleService }) => {
  const { httpRouter, middleware } = httpTool
  const h = internalRequestHandler({ service: scheduleService })

  httpRouter.get('/api/schedules', [], h.GetAll)
  httpRouter.get('/api/schedules/:scheduleId', [], h.GetOne)
}
