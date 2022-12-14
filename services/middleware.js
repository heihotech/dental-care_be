const config = require('../internal/config').Var
const { Op } = require('sequelize')
const { AuthUtil } = require('../internal/utils')

module.exports = ({ models }) => {
  return {
    JWTAuth: async (req, res, next) => {
      try {
        const bearerToken = req.headers['authorization']

        if (!bearerToken) {
          res.statusCode = 403
          throw new Error('unauthorized #1')
        }

        const bearer = bearerToken.split(' ')
        const token = bearer[1]
        const verified = await AuthUtil.VerifyJWT(token, config.SecretAuthKey)
        const { appsign } = req.cookies

        if (
          !verified.identifier ||
          appsign === '' ||
          verified.identifier !== appsign
        ) {
          res.statusCode = 403
          throw new Error('unauthorized #2')
        }

        const user = await models.User.findOne({
          where: { id: verified.id },
          attributes: ['id', 'username', 'email', 'isVerified'],
          include: [
            { model: models.Role, as: 'roles' },
            {
              model: models.Profile,
              as: 'profile',
              attributes: { exclude: ['createdAt', 'updatedAt', 'deletedAt'] },
            },
          ],
        })

        if (!user) {
          res.statusCode = 403
          throw new Error('unauthorized #3')
        }

        req.user = {
          id: user.id,
          username: user.username,
          email: user.email,
          profile: user.profile,
          roles: user.roles.map((el) => {
            return { id: el.id, name: el.name }
          }),
          isVerified: user.isVerified,
        }

        let method = {
          path: req.route.path,
          method: '',
        }

        for (const property in req.route.methods) {
          if (req.route.methods[property] === true) {
            method.method = property
          }
        }

        return next()
      } catch (err) {
        next(err)
      }
    },
    APIToken: async (req, res, next) => {
      try {
        let bearerToken = req.headers['authorization']

        if (!bearerToken) {
          res.statusCode = 403
          throw new Error('unauthorized #1')
        }

        let bearer = bearerToken.split(' ')
        let token = bearer[1]

        if (token !== config.APIToken) {
          res.statusCode = 403
          throw new Error('unauthorized #2')
        }

        return next()
      } catch (err) {
        next(err)
      }
    },
    ValidateUpload: async (req, res, next) => {
      try {
        return next()
      } catch (err) {
        next(err)
      }
    },
  }
}
