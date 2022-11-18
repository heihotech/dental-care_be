const { Op } = require('sequelize')
const Joi = require('joi')
const handler = require('../base')
const { sequelize } = require('../../infra/postgre')

const joiQueries = {
  location: Joi.string().optional().min(3),
  villageId: Joi.number().optional(),
  phone: Joi.string().optional().min(3),
  withVillage: Joi.bool().optional().default(false),
}
const joiParams = {
  withVillage: Joi.bool().optional().default(false),
}
const joiCreatePayload = {
  location: Joi.string().required().min(3),
  villageId: Joi.number().required().allow(null),
  phone: Joi.string().required().allow('', null),
  zipCode: Joi.number().required().allow('', null),
  latitude: Joi.string().optional().allow('', null),
  longitude: Joi.string().optional().allow('', null),
}
const joiEditPayload = {
  location: Joi.string().required().min(3),
  villageId: Joi.number().required(),
  phone: Joi.string().required().min(3),
  zipCode: Joi.number().required(),
  latitude: Joi.string().optional().allow('', null),
  longitude: Joi.string().optional().allow('', null),
}

module.exports = ({ models }) => {
  const h = handler('Address', 'addressId', { models })
  const buildQuery = ({ location, villageId, phone }) => {
    const condition = []

    if (location) {
      condition.push({
        location: { [Op.iLike]: `%${location}%` },
      })
    }
    if (villageId) {
      condition.push({
        villageId: { [Op.eq]: villageId },
      })
    }
    if (phone) {
      condition.push({
        phone: { [Op.iLike]: `%${phone}%` },
      })
    }

    return condition
  }

  const parseRelations = (relations = {}) => {
    const include = []
    const { Village, District, City, Province } = models
    const { withVillage } = relations

    if (withVillage) {
      include.push({
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
            attributes: { exclude: ['createdAt', 'updatedAt', 'deletedAt'] },
            include: {
              model: Province,
              as: 'province',
              attributes: { exclude: ['createdAt', 'updatedAt', 'deletedAt'] },
            },
          },
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
    await h.GetAll(parseRelations(query), buildQuery(query), query)

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
