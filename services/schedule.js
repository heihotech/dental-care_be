const { Op } = require('sequelize')
const Joi = require('joi')
const handler = require('./base')
const { sequelize } = require('../infra/postgre')

const ErrorMessage = {
  DayRequired: 'harap isi field Day range 1-31',
  MonthRequired: 'harap isi field Month range 1-12',
  YearRequired: 'harap isi field Year min 2000',
  TimeRequired: 'harap isi field Time',
}

const joiQueries = {
  day: Joi.number().optional(),
  month: Joi.number().optional(),
  year: Joi.number().optional(),
  time: Joi.string().optional(),
  withClinics: Joi.bool().optional().default(false),
}
const joiParams = {
  withClinics: Joi.bool().optional().default(false),
}
const joiCreatePayload = {
  day: Joi.number().required().min(1).max(31).message({
    'any.required': ErrorMessage.DayRequired,
  }),
  month: Joi.number().required().min(1).max(12).message({
    'any.required': ErrorMessage.MonthRequired,
  }),
  year: Joi.number().required().min(2000).message({
    'any.required': ErrorMessage.YearRequired,
  }),
  time: Joi.string().required().min(3).message({
    'any.required': ErrorMessage.TimeRequired,
  }),
}
const joiEditPayload = {
  day: Joi.number().optional().min(1).max(31).message({
    'any.required': ErrorMessage.DayRequired,
  }),
  month: Joi.number().optional().min(1).max(12).message({
    'any.required': ErrorMessage.MonthRequired,
  }),
  year: Joi.number().optional().min(2000).message({
    'any.required': ErrorMessage.YearRequired,
  }),
  time: Joi.string().optional().min(3).message({
    'any.required': ErrorMessage.TimeRequired,
  }),
}

module.exports = ({ models }) => {
  const h = handler('Schedule', 'scheduleId', { models })
  const buildQuery = ({ day, month, year, time }) => {
    const condition = []

    if (day) {
      condition.push({
        day: { [Op.eq]: day },
      })
    }
    if (month) {
      condition.push({
        month: { [Op.eq]: month },
      })
    }
    if (year) {
      condition.push({
        year: { [Op.eq]: year },
      })
    }
    if (time) {
      condition.push({
        time: { [Op.eq]: time },
      })
    }

    return condition
  }

  const parseRelations = (relations = {}) => {
    const include = []
    const { Clinic, Doctor, DoctorClinicSchedule, Profile } = models
    const { withClinics } = relations

    if (withClinics) {
      let payload = {
        model: DoctorClinicSchedule,
        as: 'doctorClinicSchedules',
        include: [
          {
            model: Doctor,
            as: 'doctor',
            attributes: { exclude: ['createdAt', 'updatedAt', 'deletedAt'] },
            include: {
              model: Profile,
              as: 'profile',
              attributes: { exclude: ['createdAt', 'updatedAt', 'deletedAt'] },
            },
          },
          {
            model: Clinic,
            as: 'clinic',
            attributes: { exclude: ['createdAt', 'updatedAt', 'deletedAt'] },
          },
        ],
        attributes: { exclude: ['createdAt', 'updatedAt', 'deletedAt'] },
      }
      include.push(payload)
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
