const { internalRequestHandler } = require('../base')
const { ResponseUtil } = require('../../../internal/utils')

module.exports = ({ httpTool, pharmacyPoolService, medicineService }) => {
  const { httpRouter, middleware } = httpTool
  const m = internalRequestHandler({ service: pharmacyPoolService })

  const CreateMedicineBatchPharmacyPoolStock = async (req, res, next) => {
    try {
      let params = {}
      params['medicineBatchId'] = await medicineService.ValidateId({
        ...req.params,
      })
      params['pharmacyPoolId'] = await pharmacyPoolService.ValidateId({
        ...req.params,
      })

      const payload =
        await pharmacyPoolService.ValidateCreateMedicineBatchPharmacyPoolStockPayload(
          {
            ...req.body,
          }
        )

      const data =
        await pharmacyPoolService.CreateMedicineBatchPharmacyPoolStock(
          {
            medicineBatchId: parseInt(params.medicineBatchId.medicineBatchId),
            pharmacyPoolId: parseInt(params.pharmacyPoolId.pharmacyPoolId),
          },
          { ...payload }
        )

      return res.send(ResponseUtil.RespJSONOk(data))
    } catch (err) {
      next(err)
    }
  }

  httpRouter.post('/api/pharmacy-pools', [middleware.JWTAuth], m.Create)
  httpRouter.post(
    '/api/pharmacy-pools/:pharmacyPoolId/medicine-batches/:medicineBatchId',
    [middleware.JWTAuth],
    CreateMedicineBatchPharmacyPoolStock
  )
}
