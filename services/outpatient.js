const { Op } = require('sequelize')
const JoiDateClass = require('@joi/date')
const Joi = require('joi')
const JoiDate = Joi.extend(JoiDateClass)
const handler = require('./base')
const { sequelize } = require('../infra/postgre')

const joiQueries = {
  patientType: Joi.number().optional(),
  registrationBookingCode: Joi.string().optional(),
  registrationNumber: Joi.string().optional(),
  patientId: Joi.number().optional(),
  doctorClinicScheduleId: Joi.number().optional(),
  visitType: Joi.number().optional(),
  referenceNumber: Joi.string().optional(),
  withPatient: Joi.bool().optional().default(false),
  withClinicDoctor: Joi.bool().optional().default(false),
}
const joiParams = {
  withPatient: Joi.bool().optional().default(false),
  withClinicDoctor: Joi.bool().optional().default(false),
}
const joiCreatePayload = {
  patientType: Joi.number().required(),
  registrationBookingCode: Joi.string().optional().allow('', null),
  registrationNumber: Joi.string().optional().allow('', null),
  patientId: Joi.number().required(),
  doctorClinicScheduleId: Joi.number().required(),
  visitType: Joi.number().required(),
  referenceNumber: Joi.string().optional().allow('', null),
  visitTimeReference: JoiDate.date().format('DD-MM-YYYY HH:mm').required(),
}
const joiEditPayload = {
  patientType: Joi.number().optional(),
  registrationBookingCode: Joi.string().optional(),
  registrationNumber: Joi.string().optional(),
  patientId: Joi.number().optional(),
  doctorClinicScheduleId: Joi.number().optional(),
  visitType: Joi.number().optional(),
  referenceNumber: Joi.string().optional(),
  visitTimeReference: JoiDate.date().format('DD-MM-YYYY HH:mm').optional(),
}

module.exports = ({ models }) => {
  const h = handler('Patient', 'patientId', { models })
  const buildQuery = ({
    patientType,
    registrationBookingCode,
    registrationNumber,
    patientId,
    doctorClinicScheduleId,
    visitType,
    referenceNumber,
  }) => {
    const condition = []

    if (patientType) {
      condition.push({
        patientType: { [Op.eq]: patientType },
      })
    }
    if (registrationBookingCode) {
      condition.push({
        registrationBookingCode: { [Op.eq]: registrationBookingCode },
      })
    }
    if (registrationNumber) {
      condition.push({
        registrationNumber: { [Op.eq]: registrationNumber },
      })
    }
    if (patientId) {
      condition.push({
        patientId: { [Op.eq]: patientId },
      })
    }
    if (doctorClinicScheduleId) {
      condition.push({
        doctorClinicScheduleId: { [Op.eq]: doctorClinicScheduleId },
      })
    }
    if (visitType) {
      condition.push({
        visitType: { [Op.eq]: visitType },
      })
    }
    if (referenceNumber) {
      condition.push({
        referenceNumber: { [Op.eq]: referenceNumber },
      })
    }

    return condition
  }

  const parseRelations = (relations = {}) => {
    const include = []
    const {
      DoctorClinicSchedule,
      Doctor,
      Clinic,
      Schedule,
      Insurance,
      Address,
      Province,
      City,
      District,
      Village,
    } = models
    const { withClinicDoctor, withPatient } = relations

    if (withPatient) {
      include.push({
        model: Patient,
        as: 'patient',
        attributes: { exclude: ['createdAt', 'updatedAt', 'deletedAt'] },
        include: {
          model: Address,
          as: 'address',
          attributes: { exclude: ['createdAt', 'updatedAt', 'deletedAt'] },
          include: {
            model: Village,
            as: 'village',
            attributes: {
              exclude: [
                'createdAt',
                'updatedAt',
                'deletedAt',
                'latitude',
                'longitude',
              ],
            },
            include: {
              model: District,
              as: 'district',
              attributes: {
                exclude: [
                  'createdAt',
                  'updatedAt',
                  'deletedAt',
                  'latitude',
                  'longitude',
                ],
              },
              include: {
                model: City,
                as: 'city',
                attributes: {
                  exclude: [
                    'createdAt',
                    'updatedAt',
                    'deletedAt',
                    'latitude',
                    'longitude',
                  ],
                },
                include: {
                  model: Province,
                  as: 'province',
                  attributes: {
                    exclude: [
                      'createdAt',
                      'updatedAt',
                      'deletedAt',
                      'latitude',
                      'longitude',
                    ],
                  },
                },
              },
            },
          },
        },
      })
    }

    if (withClinicDoctor) {
      include.push({
        model: DoctorClinicSchedule,
        as: 'doctorClinicSchedule',
        attributes: { exclude: ['createdAt', 'updatedAt', 'deletedAt'] },
        include: [
          {
            model: Doctor,
            as: 'doctor',
            attributes: { exclude: ['createdAt', 'updatedAt', 'deletedAt'] },
          },
          {
            model: Clinic,
            as: 'clinic',
            attributes: { exclude: ['createdAt', 'updatedAt', 'deletedAt'] },
          },
          {
            model: Schedule,
            as: 'schedule',
            attributes: { exclude: ['createdAt', 'updatedAt', 'deletedAt'] },
          },
        ],
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

  const GenerateRegistrationBookingCode = async () => {}

  const GenerateRegistrationNumber = async (body) => {
    const { DoctorClinicSchedule, Schedule, Clinic, Outpatient } = models

    const doctorClinicScheduleData = await DoctorClinicSchedule.findByPk(
      body.doctorClinicScheduleId,
      {
        include: {
          model: Clinic,
          as: 'clinic',
        },
      }
    )

    const countOutpatient = await Outpatient.count({
      where: { doctorClinicScheduleId: body.doctorClinicScheduleId },
    })

    const date = new Date()

    // console.log(doctorClinicScheduleData)

    let base =
      'RJ/' +
      doctorClinicScheduleData.clinic.code +
      date.getFullYear() +
      '/' +
      date.getMonth() +
      '-' +
      date.getDate() +
      '/' +
      (countOutpatient + 1)

    console.log(base)
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
    GenerateRegistrationBookingCode,
    GenerateRegistrationNumber,
  }
}
