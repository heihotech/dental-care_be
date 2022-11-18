const { ResponseUtil, AuthUtil, ErrorUtil } = require('../../internal/utils')
const config = require('../../internal/config').Var
const { Op } = require('sequelize')

const handler = ({ authService, userService }) => {
  return {
    SignUpHandler: async (req, res, next) => {
      try {
        const body = await authService.ValidateSignUp(req.body)
        const created = await authService.Register(body)

        return res.send(ResponseUtil.RespJSONOk(created, {}))
      } catch (err) {
        next(err)
      }
    },
    SignInHandler: async (req, res, next) => {
      try {
        const { identifierVar, password } = await authService.ValidateSigninReq(
          req.body
        )
        const user = await userService.GetOneByQuery(
          {
            [Op.or]: [
              {
                email: { [Op.eq]: identifierVar },
              },
              {
                username: { [Op.eq]: identifierVar },
              },
              {
                phone: { [Op.eq]: identifierVar },
              },
            ],
          },
          { withProfile: true, withRole: true, withPassword: true }
        )

        if (!user || !user.id) {
          res.status(404).send({ message: 'Data tidak ditemukan!' })
        }

        const valid = await authService.ValidatePassword(
          password,
          user.password
        )

        if (!valid) {
          res.status(401).send({ message: 'Data tidak valid!' })
        }

        const identifier = await AuthUtil.GenerateRandom(16)

        const token = await AuthUtil.GenerateJWT({
          id: user.id,
          identifier,
        })

        const secureCookie =
          config.SecureCookies && config.SecureCookies === 'true' ? true : false

        return res
          .cookie('appsign', identifier, {
            httpOnly: true,
            maxAge: 1000 * 3600 * 24 * 7,
            sameSite: true,
            secure: secureCookie,
          })
          .header({
            'Access-Control-Expose-Headers': 'X-App-Token',
            'X-App-Token': token,
          })
          .send(
            ResponseUtil.RespJSONOk(
              { userId: user.id, isVerified: user.isVerified },
              {}
            )
          )
      } catch (err) {
        next(err)
      }
    },
    SignOutHandler: async (req, res, next) => {
      try {
        return res.clearCookie('appsign', { path: '/' }).send()
      } catch (err) {
        next(err)
      }
    },
  }
}

module.exports = ({ httpTool, userService, authService }) => {
  const { httpRouter, middleware } = httpTool
  const h = handler({ userService, authService })

  httpRouter.post('/api/sign/up', [middleware.APIToken], h.SignUpHandler)
  httpRouter.post('/api/sign/in', [middleware.APIToken], h.SignInHandler)
  httpRouter.post('/api/sign/out', [middleware.JWTAuth], h.SignOutHandler)
}
