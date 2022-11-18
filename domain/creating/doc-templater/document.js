const { externalRequestHandler } = require('../base')

module.exports = ({ httpTool }) => {
  const { httpRouter, middleware } = httpTool

  const endpoint = '/api/documents'

  const h = externalRequestHandler({
    APIUrl: process.env.DOCTemplaterAPIUrl + endpoint,
    APIToken: process.env.DOCTemplaterAPIToken,
  })

  httpRouter.post(
    '/api/documents',
    [middleware.JWTAuth],
    h.CreateAndInjectActor
  )
}
