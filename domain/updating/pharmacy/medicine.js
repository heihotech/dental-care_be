const { internalRequestHandler } = require('../base')
const { ResponseUtil } = require('../../../internal/utils')

module.exports = ({ httpTool, medicineService }) => {
  const { httpRouter, middleware } = httpTool
  const m = internalRequestHandler({ service: medicineService })

  const UpdateMedicinePackage = async (req, res, next) => {
    try {
      const params = await medicineService.ValidateId({
        ...req.params,
      })
      const payload = await medicineService.ValidateEditMedicinePackagePayload({
        ...req.body,
      })
      const data = await medicineService.UpdateMedicinePackage(
        { ...params },
        { ...payload }
      )

      return res.send(ResponseUtil.RespJSONOk(data))
    } catch (err) {
      next(err)
    }
  }

  httpRouter.patch('/api/medicines/:medicineId', [middleware.JWTAuth], m.Update)
  httpRouter.patch(
    '/api/medicine-packages/:medicineId',
    [middleware.JWTAuth],
    UpdateMedicinePackage
  )
}
