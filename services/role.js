const { Op } = require('sequelize')
const Joi = require('joi')
const handler = require('./base')
const { sequelize } = require('../infra/postgre')

const ErrorMessage = {
  NameRequired: 'harap isi field Name',
}

const joiQueries = {
  name: Joi.string().optional(),
  display: Joi.string().optional(),
  withUsers: Joi.bool().optional().default(false),
  withUserProfile: Joi.bool().optional().default(false),
  withActor: Joi.bool().optional().default(false),
}
const joiParams = {
  withUsers: Joi.bool().optional().default(false),
  withUserProfile: Joi.bool().optional().default(false),
  withActor: Joi.bool().optional().default(false),
}
const joiCreatePayload = {
  name: Joi.string().required(),
  display: Joi.string().required(),
}
const joiEditPayload = {
  name: Joi.string().optional(),
  display: Joi.string().optional(),
}

module.exports = ({ models }) => {
  const h = handler('Role', 'roleId', { models })

  const countUsers = {
    query:
      '(SELECT COUNT(*) FROM "user_roles" WHERE "user_roles"."role_id" = "Role"."id")',
    attribute: 'usersCount',
  }

  const buildQuery = ({ name, display }) => {
    const condition = []

    if (name) {
      condition.push({
        name: { [Op.iLike]: `%${name}%` },
      })
    }
    if (display) {
      condition.push({
        display: { [Op.iLike]: `%${display}%` },
      })
    }

    return condition
  }

  const parseRelations = (relations = {}) => {
    const include = []
    const { User, Profile, Permission } = models
    const { withUsers, withUserProfile, withPermissions } = relations

    if (withUsers) {
      if (withUserProfile) {
        include.push({
          model: User,
          as: 'users',
          through: { attributes: [] },
          include: { model: Profile, as: 'profile' },
        })
      } else {
        include.push({ model: User, as: 'users', through: { attributes: [] } })
      }
    }

    if (withPermissions) {
      include.push({
        model: Permission,
        as: 'permissions',
        through: { attributes: [] },
      })
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

  const Create = async (payload) => await h.Create(payload)

  const Update = async (params, payload) => await h.Update(params, payload)

  const InjectActor = async (payload, user, as) =>
    await h.InjectActor(payload, user, as)

  const AssignRoleToUser = async (userId, roleId) => {
    const { UserRole } = models
    try {
      return sequelize.transaction(async (t) => {
        return await UserRole.create({
          roleId: roleId,
          userId: userId,
        })
      })
    } catch (err) {
      throw err
    }
  }

  const AssignRolesToUser = async (roles, userId) => {
    const { UserRole, Role } = models
    try {
      const exists = []

      await Promise.all(
        roles.map(async (role) => {
          const found = await Role.findByPk(role)

          if (found) {
            exists.push({
              roleId: found.id,
              userId: userId,
            })
          }

          return found
        })
      )

      return sequelize.transaction(async (t) => {
        return await UserRole.bulkCreate(exists)
      })
    } catch (err) {
      throw err
    }
  }
  const RemoveAllRolesAssignRolesToUser = async (roles, userId) => {
    const { UserRole, Role } = models
    try {
      const exists = []

      await Promise.all(
        roles.map(async (role) => {
          const found = await Role.findByPk(role)

          if (found) {
            exists.push({
              roleId: found.id,
              userId: userId,
            })
          }

          return found
        })
      )

      return sequelize.transaction(async (t) => {
        await UserRole.destroy({
          where: {
            userId: {
              [Op.eq]: userId,
            },
          },
          force: true,
          transaction: t,
        })
        return await UserRole.bulkCreate(exists, { transaction: t })
      })
    } catch (err) {
      throw err
    }
  }
  const RemoveRolesFromUser = async (roles, userId) => {
    const { UserRole } = models
    try {
      return sequelize.transaction(async (t) => {
        return await UserRole.destroy({
          where: {
            [Op.and]: [
              { userId: userId },
              {
                roleId: {
                  [Op.or]: roles,
                },
              },
            ],
          },
          force: true,
        })
      })
    } catch (err) {
      throw err
    }
  }

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
    AssignRoleToUser,
    AssignRolesToUser,
    RemoveRolesFromUser,
    RemoveAllRolesAssignRolesToUser,
  }
}
