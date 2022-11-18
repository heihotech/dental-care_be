const { ResponseUtil } = require('../../internal/utils')
const axios = require('axios')

const internalRequestHandler = ({ service }) => {
  return {
    CreateAndInjectActor: async (req, res, next) => {
      try {
        const payload = await service.ValidateCreatePayload({
          ...req.body,
        })

        const validatedPayload = await service.InjectActor(
          payload,
          req.user,
          'create'
        )

        const data = await service.Create({ ...validatedPayload })

        return res.send(ResponseUtil.RespJSONOk(data))
      } catch (err) {
        next(err)
      }
    },
    Create: async (req, res, next) => {
      try {
        const payload = await service.ValidateCreatePayload({
          ...req.body,
        })

        const data = await service.Create({ ...payload })

        return res.send(ResponseUtil.RespJSONOk(data))
      } catch (err) {
        next(err)
      }
    },
  }
}

const externalRequestHandler = ({ APIUrl, APIToken }) => {
  return {
    CreateAndInjectActor: async (req, res, next) => {
      try {
        const response = await axios.post(
          APIUrl,
          {
            ...req.body,
            createdBy: {
              id: req.user.id,
              username: req.user.username,
              email: req.user.email,
              profile: req.user.profile,
            },
          },
          {
            headers: {
              Authorization: `Bearer ${APIToken}`,
            },
          }
        )

        const { data } = response.data

        return res.send(ResponseUtil.RespJSONOk(data))
      } catch (err) {
        next(err)
      }
    },
    Create: async (req, res, next) => {
      try {
        const response = await axios.post(
          APIUrl,
          { ...req.body },
          {
            headers: {
              Authorization: `Bearer ${APIToken}`,
            },
          }
        )

        const { data } = response.data

        return res.send(ResponseUtil.RespJSONOk(data))
      } catch (err) {
        next(err)
      }
    },
  }
}

module.exports = { internalRequestHandler, externalRequestHandler }
