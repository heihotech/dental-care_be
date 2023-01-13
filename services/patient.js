const { Op } = require('sequelize')
const JoiDateClass = require('@joi/date')
const Joi = require('joi')
const JoiDate = Joi.extend(JoiDateClass)
const handler = require('./base')
const { sequelize } = require('../infra/postgre')

const joiQueries = {
  phoneNumber: Joi.string().optional().min(3),
  email: Joi.string().optional().min(3),
  fullName: Joi.string().optional().min(3),
  nik: Joi.string().optional().min(3),
  gender: Joi.string().optional().valid('M', 'F'),
  religion: Joi.string().optional().min(3),
  isIndonesian: Joi.boolean().optional().default(true),
  withAddress: Joi.bool().optional().default(false),
}
const joiParams = {
  withAddress: Joi.bool().optional().default(false),
  withRecords: Joi.bool().optional().default(false),
}
const joiCreatePayload = {
  phoneNumber: Joi.string().optional().allow('', null),
  email: Joi.string().optional().allow('', null),
  fullName: Joi.string().required().min(3),
  nik: Joi.string().optional().allow('', null),
  gender: Joi.string().required().valid('M', 'F'),
  religion: Joi.string().required().min(3),
  birthDate: JoiDate.date().required(),
  avatarUrl: Joi.string().optional().allow('', null),
  isIndonesian: Joi.boolean().optional().default(true),
}
const joiEditPayload = {
  phoneNumber: Joi.string().optional().allow('', null),
  email: Joi.string().optional().allow('', null),
  fullName: Joi.string().optional().min(3),
  nik: Joi.string().optional().allow('', null),
  gender: Joi.string().optional().valid('M', 'F'),
  religion: Joi.string().optional().min(3),
  birthDate: JoiDate.date().optional(),
  avatarUrl: Joi.string().optional().allow('', null),
  isIndonesian: Joi.boolean().optional().default(true),
}

module.exports = ({ models }) => {
  const h = handler('Patient', 'patientId', { models })
  const buildQuery = ({
    phoneNumber,
    email,
    fullName,
    nik,
    gender,
    religion,
    isIndonesian,
  }) => {
    const condition = []

    if (phoneNumber) {
      condition.push({
        phoneNumber: { [Op.iLike]: `%${phoneNumber}%` },
      })
    }
    if (email) {
      condition.push({
        email: { [Op.iLike]: `%${email}%` },
      })
    }
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

  const parseRelations = (relations = {}) => {
    const include = []
    const { BookOrder, Address, Province, City, District, Village } = models
    const { withAddress, withRecords } = relations

    if (withRecords) {
      include.push({
        model: BookOrder,
        as: 'bookOrders',
        attributes: ['arrival', 'diagnose', 'therapy', 'patientComplaint'],
      })
    }
    if (withAddress) {
      include.push({
        model: Address,
        as: 'address',
        attributes: { exclude: ['createdAt', 'updatedAt', 'deletedAt'] },
        include: {
          model: Village,
          as: 'village',
          attributes: ['name'],
          include: {
            model: District,
            as: 'district',
            attributes: ['name'],
            include: {
              model: City,
              as: 'city',
              attributes: ['name'],
              include: {
                model: Province,
                as: 'province',
                attributes: ['name'],
              },
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
