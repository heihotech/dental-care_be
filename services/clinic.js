const { Op } = require('sequelize')
const Joi = require('joi')
const handler = require('./base')
const { sequelize } = require('../infra/postgre')

const ErrorMessage = {
  CodeRequired: 'harap isi field code',
  NameRequired: 'harap isi field name',
  ScheduleRequired: 'harap isi field schedule',
}

const joiQueries = {
  code: Joi.string().optional().min(3).message({
    'any.required': ErrorMessage.CodeRequired,
  }),
  name: Joi.string().optional().min(3).message({
    'any.required': ErrorMessage.NameRequired,
  }),
  withSchedules: Joi.bool().optional().default(false),
}
const joiParams = {
  withSchedules: Joi.bool().optional().default(false),
}
const joiCreatePayload = {
  code: Joi.string().required().min(1).message({
    'any.required': ErrorMessage.CodeRequired,
  }),
  name: Joi.string().required().min(3).message({
    'any.required': ErrorMessage.NameRequired,
  }),
}
const joiEditPayload = {
  code: Joi.string().required().min(1).message({
    'any.required': ErrorMessage.CodeRequired,
  }),
  name: Joi.string().required().min(3).message({
    'any.required': ErrorMessage.NameRequired,
  }),
}

module.exports = ({ models }) => {
  const { DoctorClinicSchedule, Schedule } = models
  const h = handler('Clinic', 'clinicId', { models })
  const buildQuery = ({ name, code }) => {
    const condition = []

    if (code) {
      condition.push({
        code: { [Op.eq]: code },
      })
    }
    if (name) {
      condition.push({
        name: { [Op.iLike]: `%${name}%` },
      })
    }

    return condition
  }

  const addDays = (date, days) => {
    let newDateCondition = {
      day: null,
      month: null,
      year: null,
    }
    date.setDate(date.getDate() + parseInt(days))
    newDateCondition.day = date.getDate()
    newDateCondition.month = date.getMonth() + 1
    newDateCondition.year = date.getFullYear()
    return newDateCondition
  }

  const parseRelations = (relations = {}) => {
    const include = []
    const { DoctorClinicSchedule, Doctor, Schedule, Profile } = models
    const { withSchedules } = relations

    if (withSchedules) {
      let dateCondition = []
      const date = new Date()

      for (let i = 0; i < 7; i++) {
        let newDate = addDays(date, 1)
        dateCondition.push({ [Op.and]: [newDate] })
      }
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
            model: Schedule,
            as: 'schedule',
            where: {
              [Op.or]: dateCondition,
            },
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
    await h.GetAll(
      parseRelations(query),
      buildQuery(query),
      query,
      query.withSchedules === 'true'
        ? [
            [
              { model: DoctorClinicSchedule, as: 'doctorClinicSchedules' },
              { model: Schedule, as: 'schedule' },
              'id',
              'ASC',
            ],
          ]
        : []
    )

  const GetOne = async (params, query) =>
    await h.GetOne(
      params,
      parseRelations(query),
      query,
      query.withSchedules
        ? [
            [
              { model: DoctorClinicSchedule, as: 'doctorClinicSchedules' },
              { model: Schedule, as: 'schedule' },
              'id',
              'ASC',
            ],
          ]
        : []
    )

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
