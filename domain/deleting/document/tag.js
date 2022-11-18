const { internalRequestHandler } = require('../base')

module.exports = ({ httpTool, tagService }) => {
  const { httpRouter, middleware } = httpTool
  const h = internalRequestHandler({ service: tagService })

  httpRouter.delete('/api/tags/:tagId', [middleware.JWTAuth], h.Delete)
  httpRouter.delete(
    '/api/tags/:tagId/force',
    [middleware.JWTAuth],
    h.DeleteForce
  )
  httpRouter.delete('/api/tags/:tagId/restore', [middleware.JWTAuth], h.Restore)
}
