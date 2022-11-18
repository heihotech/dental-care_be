const axios = require('axios')
const { ResponseUtil } = require('../../internal/utils')

const internalRequestHandler = ({ service }) => {
  return {
    GetAll: async (req, res, next) => {
      try {
        const query = await service.ValidateQueries(req.query)
        const { data, meta } = await service.GetAll({ ...query })

        return res.send(ResponseUtil.RespJSONOk(data, meta))
      } catch (err) {
        next(err)
      }
    },
    GetOne: async (req, res, next) => {
      try {
        const params = await service.ValidateId({
          ...req.params,
        })
        const query = await service.ValidateQueries(req.query)
        const data = await service.GetOne({ ...params }, { ...query })

        return res.send(ResponseUtil.RespJSONOk(data))
      } catch (err) {
        next(err)
      }
    },
  }
}

const externalRequestHandler = ({ APIUrl, APIToken, paramName }) => {
  return {
    GetAll: async (req, res, next) => {
      try {
        const response = await axios.get(APIUrl, {
          params: { ...req.query },
          headers: {
            Authorization: `Bearer ${APIToken}`,
          },
        })

        const { data, meta } = response.data

        return res.send(ResponseUtil.RespJSONOk(data, meta))
      } catch (err) {
        next(err)
      }
    },
    GetOne: async (req, res, next) => {
      try {
        const response = await axios.get(APIUrl + '/' + req.params[paramName], {
          params: { ...req.query },
          headers: {
            Authorization: `Bearer ${APIToken}`,
          },
        })

        const { data } = response.data

        return res.send(ResponseUtil.RespJSONOk(data))
      } catch (err) {
        next(err)
      }
    },
  }
}

module.exports = { internalRequestHandler, externalRequestHandler }
