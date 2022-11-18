const { internalRequestHandler } = require('../base')
const { ResponseUtil } = require('../../../internal/utils')

module.exports = ({ httpTool, medicineService, medicinePackageService }) => {
  const { httpRouter, middleware } = httpTool
  const m = internalRequestHandler({ service: medicineService })

  const CreateMedicinePackage = async (req, res, next) => {
    try {
      const payload =
        await medicineService.ValidateCreateMedicinePackagePayload({
          ...req.body,
        })

      const data = await medicineService.CreateMedicinePackage({ ...payload })

      return res.send(ResponseUtil.RespJSONOk(data))
    } catch (err) {
      next(err)
    }
  }

  httpRouter.post('/api/medicines', [middleware.JWTAuth], m.Create)
  httpRouter.post(
    '/api/medicine-packages',
    [middleware.JWTAuth],
    CreateMedicinePackage
  )
}
