const { Op } = require('sequelize')
const bcrypt = require('bcryptjs')
const Joi = require('joi')
const handler = require('./base')
const { sequelize } = require('../infra/postgre')

const ErrorMessage = {
  UserIdInvalidFormat: `user id tidak valid`,
  UserIdRequired: `harap masukan user id`,
}

const joiQueries = {
  name: Joi.string().optional().min(3),
  username: Joi.string().optional().min(3),
  email: Joi.string().optional().min(3),
  phone: Joi.string().optional().min(3),
  profileId: Joi.number().optional(),
  withProfile: Joi.bool().optional().default(false),
  withRoles: Joi.bool().optional().default(false),
  withPermissions: Joi.bool().optional().default(false),
}
const joiParams = {
  userId: Joi.string().guid().required().messages({
    'any.required': ErrorMessage.UserIdRequired,
    'string.guid': ErrorMessage.UserIdInvalidFormat,
    'string.base': ErrorMessage.UserIdRequired,
    'string.required': ErrorMessage.UserIdRequired,
    'string.empty': ErrorMessage.UserIdRequired,
  }),
  withRoles: Joi.bool().optional().default(false),
  withPermissions: Joi.bool().optional().default(false),
  withProfile: Joi.bool().optional().default(true),
}
const joiCreatePayload = {
  username: Joi.string().required().min(3),
  email: Joi.string().required().min(3),
  phone: Joi.string().required().min(3),
  password: Joi.string().required().min(3),
  roles: Joi.array().optional(),
}
const joiEditPayload = {
  username: Joi.string().optional().min(3),
  email: Joi.string().optional().min(3),
  password: Joi.string().optional().min(3),
  phone: Joi.string().optional().min(3),
  profileId: Joi.number().optional(),
}

module.exports = ({ models }) => {
  const h = handler('User', 'userId', { models })
  const buildQuery = ({ username, email, phone, profileId }) => {
    const condition = []

    if (username) {
      condition.push({
        username: { [Op.iLike]: `%${username}%` },
      })
    }
    if (email) {
      condition.push({
        email: { [Op.iLike]: `%${email}%` },
      })
    }
    if (phone) {
      condition.push({
        phone: { [Op.iLike]: `%${phone}%` },
      })
    }
    if (profileId) {
      condition.push({
        profile_id: { [Op.eq]: profileId },
      })
    }

    return condition
  }

  const parseRelations = (relations = {}) => {
    const include = []
    const {
      Role,
      Profile,
      Permission,
      Address,
      Province,
      City,
      District,
      Village,
    } = models
    const { withProfile, withRoles, withPermissions, name } = relations

    if (withRoles) {
      include.push({
        model: Role,
        as: 'roles',
        through: { attributes: [] },
        attributes: {
          exclude: [
            'createdAt',
            'updatedAt',
            'deletedAt',
            'createdById',
            'updatedById',
            'deletedById',
          ],
        },
      })
    }

    if (withPermissions) {
      include.push({
        model: Permission,
        as: 'permissions',
        through: { attributes: [] },
        attributes: {
          exclude: [
            'createdAt',
            'updatedAt',
            'deletedAt',
            'createdById',
            'updatedById',
            'deletedById',
          ],
        },
      })
    }

    if (withProfile) {
      let includeWithProfile = {
        model: Profile,
        as: 'profile',
        attributes: { exclude: ['createdAt', 'updatedAt', 'deletedAt'] },
        include: {
          model: Address,
          as: 'address',
          attributes: { exclude: ['createdAt', 'updatedAt', 'deletedAt'] },
          include: {
            model: Village,
            as: 'village',
            attributes: { exclude: ['createdAt', 'updatedAt', 'deletedAt'] },
            include: {
              model: District,
              as: 'district',
              attributes: { exclude: ['createdAt', 'updatedAt', 'deletedAt'] },
              include: {
                model: City,
                as: 'city',
                attributes: {
                  exclude: ['createdAt', 'updatedAt', 'deletedAt'],
                },
                include: {
                  model: Province,
                  as: 'province',
                  attributes: {
                    exclude: ['createdAt', 'updatedAt', 'deletedAt'],
                  },
                },
              },
            },
          },
        },
      }

      if (name) {
        includeWithProfile['where'] = {
          fullName: { [Op.iLike]: `%${name}%` },
        }
      }

      include.push(includeWithProfile)
    }

    return include
  }

  const ValidateParams = async (params) =>
    await h.ValidateParams(joiParams, params)

  const ValidateQueries = async (query) =>
    await h.ValidateQueries(joiQueries, query)

  const ValidateCreatePayload = async (body) =>
    await h.ValidatePayload(joiCreatePayload, body)

  const ValidateEditPayload = async (body) =>
    await h.ValidatePayload(joiEditPayload, body)

  const ValidateId = async (params) => await h.ValidateId(params)

  const GetAll = async (query) =>
    await h.GetAll(parseRelations(query), buildQuery(query), query)

  const GetOne = async (params, query) =>
    await h.GetOne(params, parseRelations(query), query)

  const Delete = async (params, force) => await h.Delete(params, force)

  const Restore = async (params) => await h.Restore(params)

  // const Create = async (payload) => await h.Create(payload)
  const Create = async (body) => {
    const { User, Role, UserRole } = models

    const smsVerificationCode = Math.floor(100000 + Math.random() * 900000)

    const user = {
      username: body.username,
      email: body.email,
      phone: body.phone,
      password: bcrypt.hashSync(body.password, 8),
      smsVerificationCode: smsVerificationCode.toString(),
    }

    return sequelize.transaction(async (t) => {
      try {
        const createdUser = await User.create(user, {
          transaction: t,
        })

        let roles = []

        if (body.roles && body.roles.length > 0) {
          roles = await Role.findAll({
            attributes: ['id'],
            where: {
              name: {
                [Op.or]: body.roles,
              },
            },
          })
        } else {
          roles = await Role.findAll({
            attributes: ['id'],
            where: {
              name: 'user',
            },
          })
        }

        if (roles.length > 0) {
          const payload = roles.map((el) => {
            return { user_id: createdUser.id, role_id: el.id }
          })

          await UserRole.bulkCreate(payload, { transaction: t })
        }

        return createdUser
      } catch (err) {
        t.rollback()

        throw err
      }
    })
  }

  const GetOneByQuery = async (query, relations = {}) => {
    const include = parseRelations(relations)
    const { withPassword } = relations

    return withPassword
      ? await models.User.scope('withPassword').findOne({
          where: query,
          include,
        })
      : await models.User.findOne({ where: query, include })
  }

  const CheckSmsVerificationCode = async (userId, code) => {
    try {
      const found = await GetOneByQuery(
        {
          [Op.and]: [
            { id: { [Op.eq]: userId } },
            { smsVerificationCode: { [Op.eq]: code } },
          ],
        },
        {}
      )

      if (found) {
        return sequelize.transaction(async (t) => {
          try {
            await models.User.update(
              { isVerified: true },
              {
                where: {
                  id: found.id,
                },
                transaction: t,
              }
            )

            return true
          } catch (err) {
            t.rollback()

            return false
          }
        })
      } else {
        return false
      }
    } catch (err) {
      throw err
    }
  }
  const CheckEmail = async (email) => {
    try {
      const found = await GetOneByQuery({ email: { [Op.eq]: email } }, {})

      if (found) {
        return true
      }

      return false
    } catch (err) {
      throw err
    }
  }
  const CheckUsername = async (username) => {
    try {
      const found = await GetOneByQuery({ username: { [Op.eq]: username } }, {})

      if (found) {
        return true
      }

      return false
    } catch (err) {
      throw err
    }
  }
  const CheckPhone = async (phone) => {
    try {
      const found = await GetOneByQuery({ phone: { [Op.eq]: phone } }, {})

      if (found) {
        return true
      }

      return false
    } catch (err) {
      throw err
    }
  }

  const Update = async (params, payload) => {
    const { User } = models
    return sequelize.transaction(async (t) => {
      try {
        if (payload.password) {
          payload.password = bcrypt.hashSync(payload.password, 8)
        }
        const updatedData = await User.update(payload, {
          where: {
            id: params.userId,
          },
          transaction: t,
        })

        return updatedData
      } catch (err) {
        t.rollback()

        throw err
      }
    })
  }

  const InjectActor = async (payload, user, as) =>
    await h.InjectActor(payload, user, as)

  return {
    ValidateQueries,
    ValidateParams,
    ValidateCreatePayload,
    ValidateEditPayload,
    ValidateId,
    Create,
    GetAll,
    GetOne,
    Delete,
    Restore,
    Update,
    InjectActor,
    GetOneByQuery,
    CheckSmsVerificationCode,
    CheckEmail,
    CheckUsername,
    CheckPhone,
  }
}
