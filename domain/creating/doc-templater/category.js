const { externalRequestHandler } = require('../base')

module.exports = ({ httpTool }) => {
  const { httpRouter, middleware } = httpTool

  const endpoint = '/api/categories'

  const h = externalRequestHandler({
    APIUrl: process.env.DOCTemplaterAPIUrl + endpoint,
    APIToken: process.env.DOCTemplaterAPIToken,
  })

  httpRouter.post('/api/doc-categories', [middleware.JWTAuth], h.Create)
}
