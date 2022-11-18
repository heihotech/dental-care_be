const { Op } = require('sequelize')
const Joi = require('joi')
const handler = require('./base')
const { sequelize } = require('../infra/postgre')

const joiQueries = {
  specialist: Joi.string().optional().min(1),
  profileId: Joi.number().optional(),
  fullName: Joi.string().optional(),
  code: Joi.string().optional().min(1),
  withProfile: Joi.bool().optional().default(false),
}
const joiParams = {
  withProfile: Joi.bool().optional().default(false),
  withSchedules: Joi.bool().optional().default(false),
}
const joiCreatePayload = {
  specialist: Joi.string().required().min(1),
  profileId: Joi.number().required(),
  code: Joi.string().required().min(1),
}
const joiEditPayload = {
  specialist: Joi.string().optional().min(1),
  profileId: Joi.number().optional(),
  code: Joi.string().optional().min(1),
}
const joiAddClinicSchedulePayload = {
  schedules: Joi.array().required().min(1),
}

module.exports = ({ models }) => {
  const h = handler('Doctor', 'doctorId', { models })

  const { Doctor, Profile, DoctorClinicSchedule, Clinic, Schedule } = models

  const buildQuery = ({ specialist, profileId, code }) => {
    const condition = []

    if (specialist) {
      condition.push({
        specialist: { [Op.iLike]: `%${specialist}%` },
      })
    }
    if (profileId) {
      condition.push({
        profileId: { [Op.eq]: profileId },
      })
    }
    if (code) {
      condition.push({
        code: { [Op.eq]: code },
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
    const { User, Profile, DoctorClinicSchedule, Clinic, Schedule } = models
    const { withProfile, withSchedules, fullName } = relations

    if (withProfile) {
      include.push({
        model: Profile,
        as: 'profile',
        attributes: { exclude: ['createdAt', 'updatedAt', 'deletedAt'] },
        where: fullName ? { fullName: { [Op.iLike]: `%${fullName}%` } } : {},
      })
    }
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
            model: Clinic,
            as: 'clinic',
            attributes: { exclude: ['createdAt', 'updatedAt', 'deletedAt'] },
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

  const InjectActor = async (payload, user, as) =>
    await h.InjectActor(payload, user, as)

  const ValidateClinicSchedulePayload = async (body) =>
    await h.ValidatePayload(joiAddClinicSchedulePayload, body)

  const ParseSchedule = async (content) => {
    if (content.date && content.time) {
      const date = content.date.split('-')
      if (!isNaN(date[0]) && !isNaN(date[1]) && !isNaN(date[2])) {
        return {
          day: parseInt(date[0]),
          month: parseInt(date[1]),
          year: parseInt(date[2]),
          clinicId: parseInt(content.clinicId),
        }
      } else {
        return null
      }
    } else {
      return null
    }
  }

  const AddClinicSchedule = async (params, payload) => {
    const { Schedule, DoctorClinicSchedule, Clinic } = models
    const schedules = payload.schedules

    let validSchedules = []
    let invalidSchedules = []

    await Promise.all(
      schedules.map(async (el) => {
        const schedule = await ParseSchedule(el)

        if (schedule !== null) {
          const fetchedSchedule = await Schedule.findOne({
            where: {
              [Op.and]: [
                {
                  day: schedule.day,
                },
                {
                  month: schedule.month,
                },
                {
                  year: schedule.year,
                },
              ],
            },
            attributes: ['id'],
          })
          const fetchedClinic = await Clinic.findOne({
            where: {
              id: schedule.clinicId,
            },
            attributes: ['id'],
          })

          if (
            fetchedSchedule &&
            fetchedSchedule.id &&
            fetchedClinic &&
            fetchedClinic.id
          ) {
            //
            const fetchedDoctorClinicSchedule =
              await DoctorClinicSchedule.findOne({
                where: {
                  clinicId: fetchedClinic.id,
                  scheduleId: fetchedSchedule.id,
                  doctorId: params.doctorId,
                },
                attributes: ['id'],
                paranoid: false,
              })
            if (
              !(fetchedDoctorClinicSchedule && fetchedDoctorClinicSchedule.id)
            ) {
              return sequelize.transaction(async (t) => {
                const createdDoctorClinicSchedule =
                  await DoctorClinicSchedule.create(
                    {
                      clinicId: fetchedClinic.id,
                      scheduleId: fetchedSchedule.id,
                      doctorId: params.doctorId,
                    },
                    {
                      transaction: t,
                    }
                  )

                if (createdDoctorClinicSchedule) {
                  validSchedules.push(el)
                } else {
                  invalidSchedules.push(el)
                }
              })
            } else {
              return sequelize.transaction(async (t) => {
                const restoredDoctorClinicSchedule =
                  await DoctorClinicSchedule.restore({
                    where: {
                      id: fetchedDoctorClinicSchedule.id,
                    },
                    transaction: t,
                  })

                if (restoredDoctorClinicSchedule) {
                  validSchedules.push(el)
                } else {
                  invalidSchedules.push(el)
                }
              })
            }
          } else {
            invalidSchedules.push(el)
          }
        } else {
          invalidSchedules.push(el)
        }
      })
    )

    return {
      validSchedules,
      invalidSchedules,
    }
  }

  const DeleteClinicSchedule = async (params, payload) => {
    const { Schedule, DoctorClinicSchedule, Clinic } = models
    const schedules = payload.schedules

    let validSchedules = []
    let invalidSchedules = []

    await Promise.all(
      schedules.map(async (el) => {
        const schedule = await ParseSchedule(el)

        if (schedule !== null) {
          const fetchedSchedule = await Schedule.findOne({
            where: {
              [Op.and]: [
                {
                  day: schedule.day,
                },
                {
                  month: schedule.month,
                },
                {
                  year: schedule.year,
                },
              ],
            },
            attributes: ['id'],
          })
          const fetchedClinic = await Clinic.findOne({
            where: {
              id: schedule.clinicId,
            },
            attributes: ['id'],
          })

          if (
            fetchedSchedule &&
            fetchedSchedule.id &&
            fetchedClinic &&
            fetchedClinic.id
          ) {
            const fetchedDoctorClinicSchedule =
              await DoctorClinicSchedule.findOne({
                where: {
                  clinicId: fetchedClinic.id,
                  scheduleId: fetchedSchedule.id,
                  doctorId: params.doctorId,
                },
                attributes: ['id'],
              })
            if (fetchedDoctorClinicSchedule && fetchedDoctorClinicSchedule.id) {
              return sequelize.transaction(async (t) => {
                const deletedDoctorClinicSchedule =
                  await DoctorClinicSchedule.destroy({
                    where: {
                      id: fetchedDoctorClinicSchedule.id,
                    },
                    transaction: t,
                  })

                if (deletedDoctorClinicSchedule) {
                  validSchedules.push(el)
                } else {
                  invalidSchedules.push(el)
                }
              })
            } else {
              invalidSchedules.push(el)
            }
          } else {
            invalidSchedules.push(el)
          }
        } else {
          invalidSchedules.push(el)
        }
      })
    )

    return {
      validSchedules,
      invalidSchedules,
    }
  }
  const ChangeActivationClinicSchedule = async (params, payload) => {
    const { Schedule, DoctorClinicSchedule, Clinic } = models
    const schedules = payload.schedules

    let validSchedules = []
    let invalidSchedules = []

    await Promise.all(
      schedules.map(async (el) => {
        const schedule = await ParseSchedule(el)

        if (schedule !== null) {
          const fetchedSchedule = await Schedule.findOne({
            where: {
              [Op.and]: [
                {
                  day: schedule.day,
                },
                {
                  month: schedule.month,
                },
                {
                  year: schedule.year,
                },
              ],
            },
            attributes: ['id'],
          })
          const fetchedClinic = await Clinic.findOne({
            where: {
              id: schedule.clinicId,
            },
            attributes: ['id'],
          })

          if (
            fetchedSchedule &&
            fetchedSchedule.id &&
            fetchedClinic &&
            fetchedClinic.id
          ) {
            const fetchedDoctorClinicSchedule =
              await DoctorClinicSchedule.findOne({
                where: {
                  clinicId: fetchedClinic.id,
                  scheduleId: fetchedSchedule.id,
                  doctorId: params.doctorId,
                },
                attributes: ['id'],
              })
            if (fetchedDoctorClinicSchedule && fetchedDoctorClinicSchedule.id) {
              return sequelize.transaction(async (t) => {
                const updatedDoctorClinicSchedule =
                  await DoctorClinicSchedule.update(
                    {
                      isActive: el.isActive,
                    },
                    {
                      where: {
                        id: fetchedDoctorClinicSchedule.id,
                      },
                      transaction: t,
                    }
                  )

                if (updatedDoctorClinicSchedule) {
                  validSchedules.push(el)
                } else {
                  invalidSchedules.push(el)
                }
              })
            } else {
              invalidSchedules.push(el)
            }
          } else {
            invalidSchedules.push(el)
          }
        } else {
          invalidSchedules.push(el)
        }
      })
    )

    return {
      validSchedules,
      invalidSchedules,
    }
  }

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
    ValidateClinicSchedulePayload,
    ParseSchedule,
    AddClinicSchedule,
    DeleteClinicSchedule,
    ChangeActivationClinicSchedule,
  }
}
