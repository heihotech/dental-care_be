const { ResponseUtil } = require('../../internal/utils')

const handler = ({ doctorService }) => {
  return {
    InsertSchedule: async (req, res, next) => {
      try {
        const params = await doctorService.ValidateId(req.params)

        const clinicSchedules =
          await doctorService.ValidateClinicSchedulePayload(req.body)

        const data = await doctorService.AddClinicSchedule(
          params,
          clinicSchedules
        )

        res.send(ResponseUtil.RespJSONOk(data))
      } catch (err) {
        next(err)
      }
    },
    RemoveSchedule: async (req, res, next) => {
      try {
        const params = await doctorService.ValidateId(req.params)

        const clinicSchedules =
          await doctorService.ValidateClinicSchedulePayload(req.body)

        const data = await doctorService.DeleteClinicSchedule(
          params,
          clinicSchedules
        )

        res.send(ResponseUtil.RespJSONOk(data))
      } catch (err) {
        next(err)
      }
    },
    ChangeActivationSchedule: async (req, res, next) => {
      try {
        const params = await doctorService.ValidateId(req.params)

        const clinicSchedules =
          await doctorService.ValidateClinicSchedulePayload(req.body)

        const data = await doctorService.ChangeActivationClinicSchedule(
          params,
          clinicSchedules
        )

        res.send(ResponseUtil.RespJSONOk(data))
      } catch (err) {
        next(err)
      }
    },
  }
}

module.exports = ({ httpTool, doctorService }) => {
  const { httpRouter, middleware } = httpTool
  const h = handler({
    doctorService,
  })

  httpRouter.post(
    '/api/doctors/:doctorId/add-clinic-schedules',
    [],
    h.InsertSchedule
  )
  httpRouter.post(
    '/api/doctors/:doctorId/remove-clinic-schedules',
    [],
    h.RemoveSchedule
  )
  httpRouter.post(
    '/api/doctors/:doctorId/change-activation-clinic-schedules',
    [],
    h.ChangeActivationSchedule
  )
}
