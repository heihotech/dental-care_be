const { internalRequestHandler } = require('../base')

module.exports = ({ httpTool, fileService }) => {
  const { httpRouter, middleware } = httpTool
  const h = internalRequestHandler({ service: fileService })

  httpRouter.delete(
    '/api/files/:fileId',
    [middleware.JWTAuth],
    h.DeleteAndInjectActor
  )
  httpRouter.delete(
    '/api/files/:fileId/force',
    [middleware.JWTAuth],
    h.DeleteForce
  )
  httpRouter.delete(
    '/api/files/:fileId/restore',
    [middleware.JWTAuth],
    h.Restore
  )
}
