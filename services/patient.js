const { Op } = require('sequelize')
const JoiDateClass = require('@joi/date')
const Joi = require('joi')
const JoiDate = Joi.extend(JoiDateClass)
const handler = require('./base')
const { sequelize } = require('../infra/postgre')

const joiQueries = {
  phoneNumber: Joi.string().optional().min(3),
  email: Joi.string().optional().min(3),
  mrNumber: Joi.string().optional().min(3),
  bpjsNumber: Joi.string().optional().min(3),
  fullName: Joi.string().optional().min(3),
  frontTitle: Joi.string().optional().min(1),
  endTitle: Joi.string().optional().min(1),
  nik: Joi.string().optional().min(3),
  gender: Joi.string().optional().valid('M', 'F'),
  religion: Joi.string().optional().min(3),
  isIndonesian: Joi.boolean().optional().default(true),
  withInsurances: Joi.bool().optional().default(false),
  withAddress: Joi.bool().optional().default(false),
}
const joiParams = {
  withInsurances: Joi.bool().optional().default(false),
  withAddress: Joi.bool().optional().default(false),
}
const joiCreatePayload = {
  phoneNumber: Joi.string().optional().allow('', null),
  email: Joi.string().optional().allow('', null),
  mrNumber: Joi.string().optional().allow('', null),
  bpjsNumber: Joi.string().optional().allow('', null),
  fullName: Joi.string().required().min(3),
  frontTitle: Joi.string().optional().allow('', null),
  endTitle: Joi.string().optional().allow('', null),
  nik: Joi.string().optional().allow('', null),
  gender: Joi.string().required().valid('M', 'F'),
  religion: Joi.string().required().min(3),
  birthDate: JoiDate.date().format('DD-MM-YYYY').required(),
  avatarUrl: Joi.string().optional().allow('', null),
  isIndonesian: Joi.boolean().optional().default(true),
}
const joiEditPayload = {
  phoneNumber: Joi.string().optional().allow('', null),
  email: Joi.string().optional().allow('', null),
  mrNumber: Joi.string().optional().allow('', null),
  bpjsNumber: Joi.string().optional().allow('', null),
  fullName: Joi.string().optional().min(3),
  frontTitle: Joi.string().optional().allow('', null),
  endTitle: Joi.string().optional().allow('', null),
  nik: Joi.string().optional().allow('', null),
  gender: Joi.string().optional().valid('M', 'F'),
  religion: Joi.string().optional().min(3),
  birthDate: JoiDate.date().format('DD-MM-YYYY').optional(),
  avatarUrl: Joi.string().optional().allow('', null),
  isIndonesian: Joi.boolean().optional().default(true),
}

module.exports = ({ models }) => {
  const h = handler('Patient', 'patientId', { models })
  const buildQuery = ({
    phoneNumber,
    email,
    mrNumber,
    bpjsNumber,
    fullName,
    frontTitle,
    endTitle,
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
    if (mrNumber) {
      condition.push({
        mrNumber: { [Op.iLike]: `%${mrNumber}%` },
      })
    }
    if (bpjsNumber) {
      condition.push({
        bpjsNumber: { [Op.iLike]: `%${bpjsNumber}%` },
      })
    }
    if (fullName) {
      condition.push({
        fullName: { [Op.iLike]: `%${fullName}%` },
      })
    }
    if (frontTitle) {
      condition.push({
        frontTitle: { [Op.iLike]: `%${frontTitle}%` },
      })
    }
    if (endTitle) {
      condition.push({
        endTitle: { [Op.iLike]: `%${endTitle}%` },
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
    const { Insurance, Address, Province, City, District, Village } = models
    const { withInsurances, withAddress } = relations

    if (withInsurances) {
      include.push({
        model: Insurance,
        as: 'insurances',
        attributes: { exclude: ['createdAt', 'updatedAt', 'deletedAt'] },
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

  const spliceRawMrNumber = (fullString, idx, rem, str) => {
    for (let i = 0; i < idx.length; i++) {
      fullString =
        fullString.slice(0, idx[i]) +
        str +
        fullString.slice(idx[i] + Math.abs(rem))
    }
    return fullString
  }

  const getMissingNumber = (arr, n) => {
    var i = 0
    while (i < n) {
      var correctpos = arr[i] - 1
      if (arr[i] < n && arr[i] != arr[correctpos]) {
        swap(arr, i, correctpos)
      } else {
        i++
      }
    }
    for (var index = 0; index < arr.length; index++) {
      if (arr[index] != index + 1) {
        return index + 1
      }
    }
    return n
  }

  const swap = (arr, i, correctpos) => {
    var temp = arr[i]
    arr[i] = arr[correctpos]
    arr[correctpos] = temp
  }

  const GenerateMrNumber = async () => {
    const { Patient } = models
    const allPatients = await Patient.findAll({
      attributes: ['mrNumber'],
    })

    const mrPatients = [0]

    await Promise.all(
      allPatients.map((el) => {
        mrPatients.push(parseInt(el.mrNumber.split('-').join('')))
        return el
      })
    )

    const number = await getMissingNumber(mrPatients, mrPatients.length)
    const newMrNumber = String(number).padStart(6, '0')
    const formattedNewMrNumber = spliceRawMrNumber(newMrNumber, [2, 5], 0, '-')
    return formattedNewMrNumber
  }

  const ValidateMrNumber = (mrNumber) => {
    try {
      const validatedMrNumber = parseInt(mrNumber.split('-').join(''))

      if (validatedMrNumber) {
        const newMrNumber = String(validatedMrNumber).padStart(6, '0')
        const formattedNewMrNumber = spliceRawMrNumber(
          newMrNumber,
          [2, 5],
          0,
          '-'
        )
        return formattedNewMrNumber
      } else {
        throw new Error('mrNumber invalid')
      }
    } catch (error) {
      throw error
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
    GenerateMrNumber,
    ValidateMrNumber,
  }
}
