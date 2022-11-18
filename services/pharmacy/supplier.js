const { Op } = require('sequelize')
const JoiDateClass = require('@joi/date')
const Joi = require('joi')
const JoiDate = Joi.extend(JoiDateClass)
const handler = require('../base')

const { ErrorUtil, PaginationUtil } = require('../../internal/utils')
const { sequelize } = require('../../infra/postgre')

const joiQueries = {
  name: Joi.string().optional(),
  companyType: Joi.string().optional(),
  addressId: Joi.number().optional(),
  isBlacklisted: Joi.bool().optional(),
  addressedTo: Joi.bool().optional(),
  position: Joi.bool().optional(),
  taxNumber: Joi.bool().optional(),
  bankName: Joi.bool().optional(),
  bankAccountNumber: Joi.bool().optional(),
  bankAccountName: Joi.bool().optional(),

  withMedicines: Joi.bool().optional().default(false),
  withAddress: Joi.bool().optional().default(false),
}
const joiParams = {
  withMedicines: Joi.bool().optional().default(false),
  withAddress: Joi.bool().optional().default(false),
}
const joiCreatePayload = {
  name: Joi.string().required(),
  companyType: Joi.string().required(),
  addressId: Joi.number().required(),
  addressedTo: Joi.bool().required().allow('', null),
  position: Joi.bool().required().allow('', null),
  taxNumber: Joi.bool().required().allow('', null),
  bankName: Joi.bool().required().allow('', null),
  bankAccountNumber: Joi.bool().required().allow('', null),
  bankAccountName: Joi.bool().required().allow('', null),

  isBlacklisted: Joi.bool().required().default(false),
}
const joiEditPayload = {
  name: Joi.string().optional(),
  companyType: Joi.string().optional(),
  addressId: Joi.number().optional(),
  addressedTo: Joi.bool().optional().allow('', null),
  position: Joi.bool().optional().allow('', null),
  taxNumber: Joi.bool().optional().allow('', null),
  bankName: Joi.bool().optional().allow('', null),
  bankAccountNumber: Joi.bool().optional().allow('', null),
  bankAccountName: Joi.bool().optional().allow('', null),
  isBlacklisted: Joi.bool().optional().default(false),
}

module.exports = ({ models }) => {
  const h = handler('Supplier', 'supplierId', { models })
  const buildQuery = ({
    name,
    companyType,
    addressId,
    isBlacklisted,
    addressedTo,
    position,
    taxNumber,
    bankName,
    bankAccountNumber,
    bankAccountName,
  }) => {
    const condition = []

    if (name) {
      condition.push({ name: { [Op.iLike]: `%${name}%` } })
    }
    if (companyType) {
      condition.push({ companyType: { [Op.iLike]: `%${companyType}%` } })
    }
    if (addressId) {
      condition.push({ addressId: { [Op.eq]: addressId } })
    }
    if (addressedTo) {
      condition.push({ addressedTo: { [Op.iLike]: `%${addressedTo}%` } })
    }
    if (position) {
      condition.push({ position: { [Op.iLike]: `%${position}%` } })
    }
    if (taxNumber) {
      condition.push({ taxNumber: { [Op.iLike]: `%${taxNumber}%` } })
    }
    if (bankName) {
      condition.push({ bankName: { [Op.iLike]: `%${bankName}%` } })
    }
    if (bankAccountNumber) {
      condition.push({
        bankAccountNumber: { [Op.iLike]: `%${bankAccountNumber}%` },
      })
    }
    if (bankAccountName) {
      condition.push({
        bankAccountName: { [Op.iLike]: `%${bankAccountName}%` },
      })
    }

    if (typeof isBlacklisted !== 'undefined') {
      condition.push({ isBlacklisted: { [Op.eq]: isBlacklisted } })
    }

    return condition
  }

  const parseRelations = (relations = {}) => {
    const include = []
    const { Medicine, Address, Village, District, City, Province } = models
    const { withAddress, withMedicines } = relations

    if (withMedicines) {
      include.push({
        model: Medicine,
        as: 'medicines',
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
          attributes: { exclude: ['createdAt', 'updatedAt', 'deletedAt'] },
          include: {
            model: District,
            as: 'district',
            attributes: { exclude: ['createdAt', 'updatedAt', 'deletedAt'] },
            include: {
              model: City,
              as: 'city',
              attributes: { exclude: ['createdAt', 'updatedAt', 'deletedAt'] },
              include: {
                model: Province,
                as: 'province',
                attributes: {
                  exclude: ['createdAt', 'updatedAt', 'deletedAt'],
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
