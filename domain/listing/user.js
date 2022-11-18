const { ResponseUtil } = require('../../internal/utils')

const { internalRequestHandler } = require('./base')

module.exports = ({ httpTool, userService }) => {
  const { httpRouter, middleware } = httpTool
  const h = internalRequestHandler({ service: userService })

  h.GetCurrentUser = async (req, res, next) => {
    try {
      return res.send(ResponseUtil.RespJSONOk(req.user))
    } catch (err) {
      next(err)
    }
  }

  h.CheckSmsVerificationCode = async (req, res, next) => {
    try {
      if (!req.body || !req.body.userId || !req.body.code) {
        throw new Error('need parameter')
      }

      return res.send(
        ResponseUtil.RespJSONOk({
          valid: await userService.CheckSmsVerificationCode(
            req.body.userId,
            req.body.code
          ),
        })
      )
    } catch (err) {
      next(err)
    }
  }
  h.CheckEmail = async (req, res, next) => {
    try {
      if (!req.body || !req.body.email) {
        throw new Error('need parameter')
      }

      return res.send(
        ResponseUtil.RespJSONOk({
          exists: await userService.CheckEmail(req.body.email),
        })
      )
    } catch (err) {
      next(err)
    }
  }
  h.CheckPhone = async (req, res, next) => {
    try {
      if (!req.body || !req.body.phone) {
        throw new Error('need parameter')
      }

      return res.send(
        ResponseUtil.RespJSONOk({
          exists: await userService.CheckPhone(req.body.phone),
        })
      )
    } catch (err) {
      next(err)
    }
  }
  h.CheckUsername = async (req, res, next) => {
    try {
      if (!req.body || !req.body.username) {
        throw new Error('need parameter')
      }

      return res.send(
        ResponseUtil.RespJSONOk({
          exists: await userService.CheckUsername(req.body.username),
        })
      )
    } catch (err) {
      next(err)
    }
  }

  httpRouter.get('/api/users', [middleware.JWTAuth], h.GetAll)
  httpRouter.get('/api/users/:userId', [middleware.JWTAuth], h.GetOne)
  httpRouter.get('/api/user/me', [middleware.JWTAuth], h.GetCurrentUser)
  httpRouter.post(
    '/api/users/check/sms-verification-code',
    [middleware.APIToken],
    h.CheckSmsVerificationCode
  )
  httpRouter.post('/api/users/check/email', [middleware.APIToken], h.CheckEmail)
  httpRouter.post('/api/users/check/phone', [middleware.APIToken], h.CheckPhone)
  httpRouter.post(
    '/api/users/check/username',
    [middleware.APIToken],
    h.CheckUsername
  )
}
