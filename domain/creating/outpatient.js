const { ResponseUtil } = require('../../internal/utils')

const handler = ({ outpatientService }) => {
  return {
    Create: async (req, res, next) => {
      try {
        const payload = await outpatientService.ValidateCreatePayload({
          ...req.body,
        })

        if (
          !('registrationNumber' in payload) ||
          payload.registrationNumber === '' ||
          payload.registrationNumber === null
        ) {
          await outpatientService.GenerateRegistrationNumber(payload)
        } else {
        }

        const data = await outpatientService.Create({ ...payload })
        return res.send(ResponseUtil.RespJSONOk(data))
      } catch (err) {
        next(err)
      }
    },
  }
}

module.exports = ({ httpTool, outpatientService }) => {
  const { httpRouter, middleware } = httpTool
  const p = handler({ outpatientService })

  httpRouter.post('/api/outpatients', [], p.Create)
}
