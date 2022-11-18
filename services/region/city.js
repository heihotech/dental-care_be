const { Op } = require('sequelize')
const Joi = require('joi')
const handler = require('../base')
const { sequelize } = require('../../infra/postgre')

const joiQueries = {
  name: Joi.string().optional().min(3),
  withDistricts: Joi.bool().optional().default(false),
  withProvince: Joi.bool().optional().default(false),
}
const joiParams = {
  withDistricts: Joi.bool().optional().default(false),
  withProvince: Joi.bool().optional().default(false),
}
const joiCreatePayload = {
  name: Joi.string().required().min(3),
  provinceId: Joi.number().required(),
}
const joiEditPayload = {
  name: Joi.string().required().min(3),
  provinceId: Joi.number().required(),
}

module.exports = ({ models }) => {
  const h = handler('City', 'cityId', { models })

  const countInclude = {
    query:
      '(SELECT COUNT(*) FROM "districts" WHERE "districts"."city_id" = "City"."id")',
    attribute: 'districtsCount',
  }

  const buildQuery = ({ name, provinceId }) => {
    const condition = []

    if (name) {
      condition.push({
        name: { [Op.iLike]: `%${name}%` },
      })
    }
    if (provinceId) {
      condition.push({
        provinceId: { [Op.eq]: provinceId },
      })
    }

    return condition
  }

  const parseRelations = (relations = {}) => {
    const include = []
    const { Province, District } = models
    const { withDistricts, withProvince } = relations

    if (withDistricts) {
      include.push({
        model: District,
        as: 'districts',
        attributes: { exclude: ['createdAt', 'updatedAt', 'deletedAt'] },
      })
    }
    if (withProvince) {
      include.push({
        model: Province,
        as: 'province',
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
