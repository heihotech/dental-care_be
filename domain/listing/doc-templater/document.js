const { externalRequestHandler } = require('../base')

module.exports = ({ httpTool }) => {
  const { httpRouter, middleware } = httpTool

  const endpoint = '/api/documents'
  const paramName = 'documentId'

  const h = externalRequestHandler({
    APIUrl: process.env.DOCTemplaterAPIUrl + endpoint,
    APIToken: process.env.DOCTemplaterAPIToken,
    paramName: paramName,
  })

  httpRouter.get(endpoint, [middleware.JWTAuth], h.GetAll)
  httpRouter.get(endpoint + '/:' + paramName, [middleware.JWTAuth], h.GetOne)
}
