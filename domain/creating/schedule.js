const { internalRequestHandler } = require('./base')

module.exports = ({ httpTool, scheduleService }) => {
  const { httpRouter, middleware } = httpTool
  const h = internalRequestHandler({ service: scheduleService })

  httpRouter.post('/api/schedules', [middleware.JWTAuth], h.Create)
}
