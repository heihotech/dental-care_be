const { ResponseUtil } = require('../../../internal/utils')

const handler = ({ patientService, addressService }) => {
  return {
    InsertAddress: async (req, res, next) => {
      try {
        const params = await patientService.ValidateId(req.params)

        const patientData = await patientService.GetOne({ ...params }, {})

        if (patientData.addressId) {
          await addressService.Delete(
            { addressId: patientData.addressId },
            false
          )
        }

        const address = await addressService.ValidateCreatePayload({
          ...req.body,
        })

        const createdAddress = await addressService.Create({ ...address })

        const validatedPatientPayload =
          await patientService.ValidateEditPayload({
            addressId: createdAddress.id,
          })

        const data = await patientService.Update(
          { ...params },
          { ...validatedPatientPayload }
        )

        res.send(ResponseUtil.RespJSONOk(data))
      } catch (err) {
        next(err)
      }
    },
  }
}

module.exports = ({ httpTool, patientService, addressService }) => {
  const { httpRouter, middleware } = httpTool
  const h = handler({
    patientService,
    addressService,
  })

  httpRouter.post('/api/patients/:patientId/addresses', [], h.InsertAddress)
}
