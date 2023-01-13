const { Op } = require('sequelize')
const JoiDateClass = require('@joi/date')
const Joi = require('joi')
const JoiDate = Joi.extend(JoiDateClass)
const handler = require('./base')
const { sequelize } = require('../infra/postgre')

const joiQueries = {
  patientId: Joi.number().optional(),
  doctorId: Joi.number().optional(),
  scheduleId: Joi.number().optional(),
  patientComplaint: Joi.string().optional().min(1),
  fullName: Joi.string().optional().min(1),
  phoneNumber: Joi.string().optional().min(1),
  diagnose: Joi.string().optional().min(1),
  therapy: Joi.string().optional().min(1),
  complaint: Joi.string().optional().min(1),
  onlyNotValidated: Joi.bool().optional().default(false),
  onlyNotEvaluated: Joi.bool().optional().default(false),
  onlyEvaluated: Joi.bool().optional().default(false),
}
const joiParams = {
  withDoctor: Joi.bool().optional().default(false),
  withSchedule: Joi.bool().optional().default(false),
  withPatient: Joi.bool().optional().default(false),
  onlyNotValidated: Joi.bool().optional().default(false),
  onlyNotEvaluated: Joi.bool().optional().default(false),
  onlyEvaluated: Joi.bool().optional().default(false),
}
const joiCreatePayload = {
  doctorId: Joi.number().required(),
  patientId: Joi.number().required().allow(null),
  scheduleId: Joi.number().required().allow(null),
  arrivalPlan: JoiDate.date().required().allow(null),
  arrival: JoiDate.date().required().allow(null),
  patientComplaint: Joi.string().required().allow(null, ''),
  fullName: Joi.string().required().min(1),
  phoneNumber: Joi.string().required().min(1),
}
const joiEditPayload = {
  patientId: Joi.number().optional(),
  arrival: JoiDate.date().required().allow(null),
  doctorId: Joi.number().optional(),
  scheduleId: Joi.number().optional(),
  arrivalPlan: JoiDate.date().optional(),
  patientComplaint: Joi.string().optional().allow(null, ''),
  fullName: Joi.string().optional().min(1),
  phoneNumber: Joi.string().optional().min(1),
  diagnose: Joi.string().optional().allow(null, ''),
  therapy: Joi.string().optional().allow(null, ''),
  cost: Joi.number().optional(),
  complaint: Joi.string().optional().allow(null, ''),
}

module.exports = ({ models }) => {
  const h = handler('BookOrder', 'bookOrderId', { models })

  const { User, Profile, Schedule, Patient, Doctor } = models

  const buildQuery = ({
    patientId,
    doctorId,
    scheduleId,
    patientComplaint,
    fullName,
    phoneNumber,
    diagnose,
    therapy,
    complaint,
    onlyNotValidated,
    onlyNotEvaluated,
    onlyEvaluated,
  }) => {
    const condition = []

    if (onlyNotValidated) {
      condition.push({
        [Op.and]: [
          { arrival: { [Op.is]: null } },
          { patientId: { [Op.is]: null } },
        ],
      })
    } else if (onlyNotEvaluated) {
      condition.push({
        [Op.and]: [
          { arrival: { [Op.not]: null } },
          { patientId: { [Op.not]: null } },
          { diagnose: { [Op.is]: null } },
          { therapy: { [Op.is]: null } },
          { cost: { [Op.is]: null } },
        ],
      })
    } else if (onlyEvaluated) {
      condition.push({
        [Op.and]: [
          { arrival: { [Op.not]: null } },
          { patientId: { [Op.not]: null } },
          {
            [Op.or]: [
              { diagnose: { [Op.not]: null } },
              { therapy: { [Op.not]: null } },
              { cost: { [Op.not]: null } },
            ],
          },
        ],
      })
    }

    if (patientId) {
      condition.push({ patientId: { [Op.eq]: patientId } })
    }
    if (doctorId) {
      condition.push({ doctorId: { [Op.eq]: doctorId } })
    }
    if (scheduleId) {
      condition.push({ scheduleId: { [Op.eq]: scheduleId } })
    }
    if (patientComplaint) {
      condition.push({
        patientComplaint: { [Op.iLike]: `%${patientComplaint}%` },
      })
    }
    if (fullName) {
      condition.push({ fullName: { [Op.iLike]: `%${fullName}%` } })
    }
    if (phoneNumber) {
      condition.push({ phoneNumber: { [Op.iLike]: `%${phoneNumber}%` } })
    }
    if (diagnose) {
      condition.push({ diagnose: { [Op.iLike]: `%${diagnose}%` } })
    }
    if (therapy) {
      condition.push({ therapy: { [Op.iLike]: `%${therapy}%` } })
    }
    if (complaint) {
      condition.push({ complaint: { [Op.iLike]: `%${complaint}%` } })
    }

    return condition
  }

  const parseRelations = (relations = {}) => {
    const include = []

    const { withDoctor, withSchedule, withPatient } = relations

    if (withDoctor) {
      include.push({
        model: Doctor,
        as: 'doctor',
        attributes: { exclude: ['createdAt', 'updatedAt', 'deletedAt'] },
        include: {
          model: User,
          as: 'user',
          attributes: { exclude: ['createdAt', 'updatedAt', 'deletedAt'] },
          include: {
            model: Profile,
            as: 'profile',
            attributes: { exclude: ['createdAt', 'updatedAt', 'deletedAt'] },
          },
        },
      })
    }
    if (withSchedule) {
      include.push({
        model: Schedule,
        as: 'schedule',
        attributes: { exclude: ['createdAt', 'updatedAt', 'deletedAt'] },
      })
    }
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
