const { Op } = require('sequelize')
const Joi = require('joi')
const handler = require('./base')
const { sequelize } = require('../infra/postgre')

const joiQueries = {
  specialist: Joi.string().optional().min(1),
  userId: Joi.number().optional(),
  fullName: Joi.string().optional(),
  code: Joi.string().optional().min(1),
}
const joiParams = {
  withProfile: Joi.bool().optional().default(false),
  withSchedules: Joi.bool().optional().default(false),
}
const joiCreatePayload = {
  specialist: Joi.string().required().min(1),
  userId: Joi.number().required(),
  code: Joi.string().required().min(1),
}
const joiEditPayload = {
  specialist: Joi.string().optional().min(1),
  userId: Joi.number().optional(),
  code: Joi.string().optional().min(1),
}

module.exports = ({ models }) => {
  const h = handler('Doctor', 'doctorId', { models })

  const { User, Profile, Schedule } = models

  const buildQuery = ({ specialist, userId, code }) => {
    const condition = []

    if (specialist) {
      condition.push({
        specialist: { [Op.iLike]: `%${specialist}%` },
      })
    }
    if (userId) {
      condition.push({
        userId: { [Op.eq]: userId },
      })
    }
    if (code) {
      condition.push({
        code: { [Op.eq]: code },
      })
    }

    return condition
  }

  const parseRelations = (relations = {}) => {
    const include = []

    const { withProfile, withSchedules, fullName } = relations

    if (withProfile) {
      include.push({
        model: User,
        as: 'user',
        attributes: { exclude: ['createdAt', 'updatedAt', 'deletedAt'] },
        include: {
          model: Profile,
          as: 'profile',
          attributes: { exclude: ['createdAt', 'updatedAt', 'deletedAt'] },
          where: fullName ? { fullName: { [Op.iLike]: `%${fullName}%` } } : {},
        },
      })
    }
    if (withSchedules) {
      include.push({
        model: Schedule,
        as: 'schedules',
        attributes: { exclude: ['createdAt', 'updatedAt', 'deletedAt'] },
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

  const Delete = async (params, force) => await h.Delete(params, force)

  const Restore = async (params) => await h.Restore(params)

  const Create = async (payload) => await h.Create(payload)

  const Update = async (params, payload) => await h.Update(params, payload)

  const GetAll = async (query) =>
    await h.GetAll(parseRelations(query), buildQuery(query), query)

  const GetOne = async (params, query) =>
    await h.GetOne(params, parseRelations(query, params), query)

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
  }
}
