const { ResponseUtil } = require('../../internal/utils')

const handler = ({ patientService, addressService }) => {
  return {
    Create: async (req, res, next) => {
      try {
        const addressPayload = await addressService.ValidateCreatePayload({
          ...req.body.address,
        })

        const addressData = await addressService.Create({ ...addressPayload })

        const payload = await patientService.ValidateCreatePayload({
          ...req.body,
        })

        if (addressData.id) {
          payload['addressId'] = addressData.id
        }

        if (!('mrNumber' in payload)) {
          const mrNumber = await patientService.GenerateMrNumber()
          console.log(mrNumber)
          payload['mrNumber'] = mrNumber
        } else {
          payload.mrNumber = await patientService.ValidateMrNumber(
            payload.mrNumber
          )
        }

        const data = await patientService.Create({ ...payload })
        return res.send(ResponseUtil.RespJSONOk(data))
      } catch (err) {
        next(err)
      }
    },
  }
}

module.exports = ({ httpTool, patientService, addressService }) => {
  const { httpRouter, middleware } = httpTool
  const p = handler({ patientService, addressService })

  httpRouter.post('/api/patients', [], p.Create)
}
