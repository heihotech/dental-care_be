const { ResponseUtil } = require('../../internal/utils')

const handler = ({ clinicService, scheduleService }) => {
  return {
    InsertSchedule: async (req, res, next) => {
      try {
        const params = await clinicService.ValidateId(req.params)

        const schedules = await clinicService.ValidateAddSchedulePayload(
          req.body
        )

        const data = await clinicService.AddSchedule(params, schedules)

        res.send(ResponseUtil.RespJSONOk(data))
      } catch (err) {
        next(err)
      }
    },
  }
}

module.exports = ({ httpTool, clinicService, scheduleService }) => {
  const { httpRouter, middleware } = httpTool
  const h = handler({
    clinicService,
    scheduleService,
  })

  httpRouter.post('/api/clinics/:clinicId/schedules', [], h.InsertSchedule)
}
