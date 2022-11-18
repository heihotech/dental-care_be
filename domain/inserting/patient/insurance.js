const { ResponseUtil } = require('../../../internal/utils')

const handler = ({ patientService, insuranceService }) => {
  return {
    Insertinsurance: async (req, res, next) => {
      try {
        const params = await patientService.ValidateId(req.params)

        const insurance = await insuranceService.ValidateCreatePayload({
          ...req.body,
          ...params,
        })

        const data = await insuranceService.Create({ ...insurance })

        res.send(ResponseUtil.RespJSONOk(data))
      } catch (err) {
        next(err)
      }
    },
  }
}

module.exports = ({ httpTool, patientService, insuranceService }) => {
  const { httpRouter, middleware } = httpTool
  const h = handler({
    patientService,
    insuranceService,
  })

  httpRouter.post('/api/patients/:patientId/insurances', [], h.Insertinsurance)
}
