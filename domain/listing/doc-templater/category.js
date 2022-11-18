const { externalRequestHandler } = require('../base')
const axios = require('axios')
const { ResponseUtil } = require('../../../internal/utils')

const customHandler = ({ APIUrl, APIToken, paramName }) => {
  return {
    GetParent: async (req, res, next) => {
      try {
        const response = await axios.get(
          APIUrl + '/' + req.params[paramName] + '/parent',
          {
            params: { ...req.query },
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

module.exports = ({ httpTool }) => {
  const { httpRouter, middleware } = httpTool

  const endpoint = '/api/categories'
  const paramName = 'categoryId'

  const h = externalRequestHandler({
    APIUrl: process.env.DOCTemplaterAPIUrl + endpoint,
    APIToken: process.env.DOCTemplaterAPIToken,
    paramName: paramName,
  })
  const ch = customHandler({
    APIUrl: process.env.DOCTemplaterAPIUrl + endpoint,
    APIToken: process.env.DOCTemplaterAPIToken,
    paramName: paramName,
  })

  httpRouter.get('/api/doc-categories', [middleware.JWTAuth], h.GetAll)
  httpRouter.get(
    '/api/doc-categories' + '/:' + paramName,
    [middleware.JWTAuth],
    h.GetOne
  )
  httpRouter.get(
    '/api/doc-categories' + '/:' + paramName + '/parent',
    [middleware.JWTAuth],
    ch.GetParent
  )
}
