const { ResponseUtil } = require('../../internal/utils')

const internalRequestHandler = ({ service }) => {
  return {
    Insert: async (req, res, next) => {
      try {
        let path = req.path.split('/')

        const params = await service.ValidateId(req.params)

        const validatedInsertPayload = await service.ValidateInsertPayload({
          ...req.body,
        })

        const data = await service.Insert(
          params,
          validatedInsertPayload,
          path[4]
        )

        res.send(ResponseUtil.RespJSONOk(data))
      } catch (err) {
        next(err)
      }
    },
  }
}

module.exports = { internalRequestHandler }
