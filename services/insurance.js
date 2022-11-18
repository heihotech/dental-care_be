const { Op } = require('sequelize')
const JoiDateClass = require('@joi/date')
const Joi = require('joi')
const JoiDate = Joi.extend(JoiDateClass)
const handler = require('./base')

const joiQueries = {
  number: Joi.string().optional().min(3),
  name: Joi.string().optional().min(3),
  isLifetime: Joi.bool().optional().default(false),
  source: Joi.string().optional(),
  patientId: Joi.string().optional().min(3),
  classRight: Joi.number().optional(),
  withPatient: Joi.bool().optional().default(false),
}
const joiParams = {
  withPatient: Joi.bool().optional().default(false),
}
const joiCreatePayload = {
  number: Joi.string().required().min(3),
  name: Joi.string().required().min(3),
  validUntil: JoiDate.date().format('DD-MM-YYYY').optional().allow(null),
  isLifetime: Joi.bool().required().default(false),
  source: Joi.string().required().min(3),
  notes: Joi.string().optional().allow('', null),
  imageUrl: Joi.string().optional().allow('', null),
  classRight: Joi.number().optional().allow('', null),
  patientId: Joi.string().required(),
}
const joiEditPayload = {
  number: Joi.string().optional().min(3),
  name: Joi.string().optional().min(3),
  validUntil: JoiDate.date().format('DD-MM-YYYY').optional().allow(null),
  isLifetime: Joi.bool().optional().default(false),
  source: Joi.string().optional().min(3),
  notes: Joi.string().optional().allow('', null),
  imageUrl: Joi.string().optional().allow('', null),
  classRight: Joi.number().optional().allow('', null),
  patientId: Joi.string().optional(),
}

module.exports = ({ models }) => {
  const h = handler('Insurance', 'insuranceId', { models })
  const buildQuery = ({
    number,
    name,
    isLifetime,
    source,
    patientId,
    classRight,
  }) => {
    const condition = []

    if (number) {
      condition.push({
        number: { [Op.iLike]: `%${number}%` },
      })
    }
    if (name) {
      condition.push({
        name: { [Op.iLike]: `%${name}%` },
      })
    }
    if (isLifetime) {
      condition.push({
        isLifetime: { [Op.eq]: isLifetime },
      })
    }
    if (source) {
      condition.push({
        source: { [Op.iLike]: `%${source}%` },
      })
    }
    if (patientId) {
      condition.push({
        patientId: { [Op.eq]: patientId },
      })
    }
    if (classRight) {
      condition.push({
        classRight: { [Op.eq]: classRight },
      })
    }

    return condition
  }

  const parseRelations = (relations = {}) => {
    const include = []
    const { Patient } = models
    const { withPatient } = relations

    if (withPatient) {
      include.push({
        model: Patient,
        as: 'patient',
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
