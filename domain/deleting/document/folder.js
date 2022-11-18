const { internalRequestHandler } = require('../base')

module.exports = ({ httpTool, folderService }) => {
  const { httpRouter, middleware } = httpTool
  const h = internalRequestHandler({ service: folderService })

  httpRouter.delete(
    '/api/folders/:folderId',
    [middleware.JWTAuth],
    h.DeleteAndInjectActor
  )
  httpRouter.delete(
    '/api/folders/:folderId/force',
    [middleware.JWTAuth],
    h.DeleteForce
  )
  httpRouter.delete(
    '/api/folders/:folderId/restore',
    [middleware.JWTAuth],
    h.Restore
  )
}
