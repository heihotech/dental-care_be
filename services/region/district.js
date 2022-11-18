const { Op } = require('sequelize')
const Joi = require('joi')
const handler = require('../base')
const { sequelize } = require('../../infra/postgre')

const joiQueries = {
  name: Joi.string().optional().min(3),
  withVillages: Joi.bool().optional().default(false),
  withCity: Joi.bool().optional().default(false),
}
const joiParams = {
  withVillages: Joi.bool().optional().default(false),
  withCity: Joi.bool().optional().default(false),
}
const joiCreatePayload = {
  name: Joi.string().required().min(3),
  cityId: Joi.number().required(),
}
const joiEditPayload = {
  name: Joi.string().required().min(3),
  cityId: Joi.number().required(),
}

module.exports = ({ models }) => {
  const h = handler('District', 'districtId', { models })

  const countInclude = {
    query:
      '(SELECT COUNT(*) FROM "villages" WHERE "villages"."district_id" = "District"."id")',
    attribute: 'villagesCount',
  }

  const buildQuery = ({ name, cityId }) => {
    const condition = []

    if (name) {
      condition.push({
        name: { [Op.iLike]: `%${name}%` },
      })
    }
    if (cityId) {
      condition.push({
        cityId: { [Op.eq]: cityId },
      })
    }

    return condition
  }

  const parseRelations = (relations = {}) => {
    const include = []
    const { Province, City, Village } = models
    const { withVillages, withCity } = relations

    if (withVillages) {
      include.push({
        model: Village,
        as: 'villages',
        attributes: { exclude: ['createdAt', 'updatedAt', 'deletedAt'] },
      })
    }
    if (withCity) {
      include.push({
        model: City,
        as: 'city',
        attributes: { exclude: ['createdAt', 'updatedAt', 'deletedAt'] },
        include: {
          model: Province,
          as: 'province',
          attributes: { exclude: ['createdAt', 'updatedAt', 'deletedAt'] },
        },
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
    await h.GetAll(parseRelations(query), buildQuery(query), query, [
      countInclude,
    ])

  const GetOne = async (params, query) =>
    await h.GetOne(params, parseRelations(query), query)

  const Delete = async (params, force) => await h.Delete(params, force)

  const Restore = async (params) => await h.Restore(params)

  const Create = async (payload) => await h.Create(payload)

  const Update = async (params, payload) => await h.Update(params, payload)

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
  }
}
