const { Op } = require('sequelize')
const JoiDateClass = require('@joi/date')
const Joi = require('joi')
const JoiDate = Joi.extend(JoiDateClass)
const handler = require('./base')
const { sequelize } = require('../infra/postgre')

const ErrorMessage = {
  NameRequired: 'harap isi field Name',
}

const joiQueries = {
  fullName: Joi.string().optional().min(3),
  nik: Joi.string().optional().min(3),
  employeeId: Joi.string().optional().min(3),
  gender: Joi.string().optional().valid('M', 'F'),
  religion: Joi.string().optional().min(3),
  isIndonesian: Joi.boolean().optional().allow('', null),
  withUser: Joi.bool().optional().default(false),
}
const joiParams = {
  withUser: Joi.bool().optional().default(false),
}
const joiCreatePayload = {
  fullName: Joi.string().required().min(3),
  nik: Joi.string().required().min(3),
  employeeId: Joi.string().required().min(3),
  gender: Joi.string().required().valid('M', 'F'),
  religion: Joi.string().required().min(3),
  birthDate: JoiDate.date().format('DD-MM-YYYY').required(),
  avatarUrl: Joi.string().optional().default(''),
  isIndonesian: Joi.boolean().optional().allow('', null),
}
const joiEditPayload = {
  fullName: Joi.string().optional().min(3),
  nik: Joi.string().optional().min(3),
  employeeId: Joi.string().optional().min(3),
  gender: Joi.string().optional().valid('M', 'F'),
  religion: Joi.string().optional().min(3),
  birthDate: JoiDate.date().format('DD-MM-YYYY').optional(),
  avatarUrl: Joi.string().optional(),
  isIndonesian: Joi.boolean().optional().allow('', null),
}

const joiInsertPayload = {
  findOrCreate: Joi.bool().optional().default(false),
  deleteAllBefore: Joi.bool().optional().default(false),
  data: Joi.array().required().min(1),
}

module.exports = ({ models }) => {
  const h = handler('Profile', 'profileId', { models })
  const buildQuery = ({
    fullName,
    nik,
    employeeId,
    gender,
    religion,
    isIndonesian,
  }) => {
    const condition = []

    if (fullName) {
      condition.push({
        fullName: { [Op.iLike]: `%${fullName}%` },
      })
    }
    if (nik) {
      condition.push({
        nik: { [Op.iLike]: `%${nik}%` },
      })
    }
    if (employeeId) {
      condition.push({
        employeeId: { [Op.iLike]: `%${employeeId}%` },
      })
    }

    if (gender) {
      condition.push({
        gender: { [Op.eq]: gender },
      })
    }
    if (religion) {
      condition.push({
        religion: { [Op.eq]: religion },
      })
    }
    if (isIndonesian) {
      condition.push({
        isIndonesian: { [Op.eq]: isIndonesian },
      })
    }

    return condition
  }

  const parseRelations = (relations = {}, params) => {
    const include = []
    const { User, Profile } = models
    const { withUser } = relations

    if (withUser) {
      include.push({ model: User, as: 'user' })
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

  const ValidateInsertPayload = async (body) =>
    await h.ValidatePayload(joiInsertPayload, body)

  const ValidateId = async (params) => await h.ValidateId(params)

  const GetAll = async (query) =>
    await h.GetAll(parseRelations(query), buildQuery(query), query)

  const GetOne = async (params, query) =>
    await h.GetOne(params, parseRelations(query, params), query)

  const Delete = async (params, force) => await h.Delete(params, force)

  const Restore = async (params) => await h.Restore(params)

  const Create = async (payload) => await h.Create(payload)

  const Update = async (params, payload) => await h.Update(params, payload)

  const InjectActor = async (payload, user, as) =>
    await h.InjectActor(payload, user, as)

  const Insert = async (params, payload, model) => {
    switch (model) {
      case 'relations':
        await InsertRelation(params, payload)
        break

      default:
        break
    }
  }

  return {
    ValidateQueries,
    ValidateParams,
    ValidateCreatePayload,
    ValidateEditPayload,
    ValidateInsertPayload,
    ValidateId,
    Create,
    GetAll,
    GetOne,
    Delete,
    Restore,
    Update,
    InjectActor,
    Insert,
  }
}
