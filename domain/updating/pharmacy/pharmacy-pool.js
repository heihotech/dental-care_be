const { internalRequestHandler } = require('../base')
const { ResponseUtil } = require('../../../internal/utils')

module.exports = ({ httpTool, pharmacyPoolService, medicineService }) => {
  const { httpRouter, middleware } = httpTool
  const m = internalRequestHandler({ service: pharmacyPoolService })

  const UpdateMedicineStock = async (req, res, next) => {
    try {
      let params = {}
      params['medicineId'] = await medicineService.ValidateId({
        ...req.params,
      })
      params['pharmacyPoolId'] = await pharmacyPoolService.ValidateId({
        ...req.params,
      })

      const payload = await pharmacyPoolService.ValidateEditStockPayload({
        ...req.body,
      })

      const data = await pharmacyPoolService.UpdateMedicineStock(
        {
          medicineId: parseInt(params.medicineId.medicineId),
          pharmacyPoolId: parseInt(params.pharmacyPoolId.pharmacyPoolId),
        },
        { ...payload }
      )

      return res.send(ResponseUtil.RespJSONOk(data))
    } catch (err) {
      next(err)
    }
  }

  httpRouter.patch(
    '/api/pharmacy-pools/:pharmacyPoolId',
    [middleware.JWTAuth],
    m.Update
  )
  httpRouter.post(
    '/api/pharmacy-pools/:pharmacyPoolId/medicines/:medicineId',
    [middleware.JWTAuth],
    UpdateMedicineStock
  )
}
