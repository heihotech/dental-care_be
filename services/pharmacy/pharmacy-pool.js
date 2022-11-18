const { Op } = require('sequelize')
const JoiDateClass = require('@joi/date')
const Joi = require('joi')
const JoiDate = Joi.extend(JoiDateClass)
const handler = require('../base')

const { ErrorUtil, PaginationUtil } = require('../../internal/utils')
const { sequelize } = require('../../infra/postgre')

const joiQueries = {
  code: Joi.string().optional(),
  name: Joi.string().optional(),
  type: Joi.number().optional(),
  location: Joi.string().optional(),
}
const joiParams = {}
const joiCreatePayload = {
  code: Joi.string().required(),
  name: Joi.string().required(),
  type: Joi.number().required(),
  location: Joi.string().optional().allow(null, ''),
}
const joiEditPayload = {
  code: Joi.string().optional(),
  name: Joi.string().optional(),
  type: Joi.number().optional(),
  location: Joi.string().optional().allow(null, ''),
}

module.exports = ({ models }) => {
  const h = handler('PharmacyPool', 'pharmacyPoolId', { models })
  const buildQuery = ({ code, name, type, location }) => {
    const condition = []

    if (code) {
      condition.push({ code: { [Op.iLike]: `%${code}%` } })
    }
    if (name) {
      condition.push({ name: { [Op.iLike]: `%${name}%` } })
    }
    if (type) {
      condition.push({ type: { [Op.eq]: type } })
    }
    if (location) {
      condition.push({ location: { [Op.iLike]: `%${location}%` } })
    }

    return condition
  }

  const parseRelations = (relations = {}) => {
    const include = []
    const { MedicineBatch, Medicine } = models
    const { medicineName } = relations

    // if (medicineName) {
    //   include.push({
    //     model: MedicineBatch,
    //     include: {
    //       model: Medicine,
    //       as: 'medicines',
    //       attributes: { exclude: ['createdAt', 'updatedAt', 'deletedAt'] },
    //       through: {
    //         attributes: ['quantity', 'uom'],
    //       },
    //       where: {
    //         name: { [Op.iLike]: `%${medicineName}%` },
    //       },
    //     },
    //   })
    // }

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

  // const ValidateEditStockPayload = async (body) =>
  //   await h.ValidatePayload(joiEditStock, body)

  // const ValidateCreateMedicineBatchPharmacyPoolPayload = async (body) =>
  //   await h.ValidatePayload(joiCreateMedicineBatchPharmacyPoolPayload, body)

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
