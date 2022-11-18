const { Op } = require('sequelize')
const JoiDateClass = require('@joi/date')
const Joi = require('joi')
const JoiDate = Joi.extend(JoiDateClass)
const handler = require('../base')

const { ErrorUtil, PaginationUtil } = require('../../internal/utils')
const { sequelize } = require('../../infra/postgre')

const joiQueries = {
  handOverNumber: Joi.string().optional().allow('', null),
  handOverUrl: Joi.string().optional().allow('', null),
  invoiceNumber: Joi.string().optional().allow('', null),
  invoiceUrl: Joi.string().optional().allow('', null),
  invoiceDateStart: JoiDate.date().format('DD-MM-YYYY').optional(),
  invoiceDateEnd: JoiDate.date().format('DD-MM-YYYY').optional(),
  name: Joi.string().optional().allow('', null),
  priceStart: Joi.number().optional(),
  priceEnd: Joi.number().optional(),
  totalPriceStart: Joi.number().optional(),
  totalPriceEnd: Joi.number().optional(),
  taxStart: Joi.number().optional(),
  taxEnd: Joi.number().optional(),
  taxPercentageStart: Joi.number().optional(),
  taxPercentageEnd: Joi.number().optional(),
  finalPriceStart: Joi.number().optional(),
  finalPriceEnd: Joi.number().optional(),
  supplierId: Joi.number().optional().allow(null),
  currentStateId: Joi.number().optional().allow(null),
  creatorId: Joi.number().optional().allow(null),
  validatorId: Joi.number().optional().allow(null),
  validatedAtStart: JoiDate.date().format('DD-MM-YYYY').optional(),
  validatedAtEnd: JoiDate.date().format('DD-MM-YYYY').optional(),

  withSupplier: Joi.bool().optional().default(false),
  withCreator: Joi.bool().optional().default(false),
  withValidator: Joi.bool().optional().default(false),
  withCurrentState: Joi.bool().optional().default(false),
  withLogs: Joi.bool().optional().default(false),
}
const joiParams = {
  withSupplier: Joi.bool().optional().default(false),
  withCreator: Joi.bool().optional().default(false),
  withValidator: Joi.bool().optional().default(false),
  withCurrentState: Joi.bool().optional().default(false),
  withLogs: Joi.bool().optional().default(false),
}
const joiCreatePayload = {
  handOverNumber: Joi.string().optional().allow(null),
  handOverUrl: Joi.string().optional().allow(null),
  invoiceNumber: Joi.string().optional().allow(null),
  invoiceUrl: Joi.string().optional().allow(null),
  invoiceDate: JoiDate.date().format('DD-MM-YYYY').optional(),
  name: Joi.string().optional().allow(null),
  price: Joi.string().required(),
  totalPrice: Joi.string().required(),
  tax: Joi.string().required(),
  taxPercentage: Joi.string().required(),
  finalPrice: Joi.string().required(),
  supplierId: Joi.string().optional().allow(null),
  currentStateId: Joi.string().optional().allow(null),
  creatorId: Joi.string().optional().allow(null),
  validatorId: Joi.string().optional().allow(null),
  validatedAt: JoiDate.date().format('DD-MM-YYYY').optional(),
}
const joiEditPayload = {
  handOverNumber: Joi.string().optional().allow(null),
  handOverUrl: Joi.string().optional().allow(null),
  invoiceNumber: Joi.string().optional().allow(null),
  invoiceUrl: Joi.string().optional().allow(null),
  invoiceDate: JoiDate.date().format('DD-MM-YYYY').optional(),
  name: Joi.string().optional().allow(null),
  price: Joi.string().optional(),
  totalPrice: Joi.string().optional(),
  tax: Joi.string().optional(),
  taxPercentage: Joi.string().optional(),
  finalPrice: Joi.string().optional(),
  supplierId: Joi.string().optional().allow(null),
  currentStateId: Joi.string().optional().allow(null),
  creatorId: Joi.string().optional().allow(null),
  validatorId: Joi.string().optional().allow(null),
  validatedAt: JoiDate.date().format('DD-MM-YYYY').optional(),
}

module.exports = ({ models }) => {
  const h = handler('PharmacyProcurement', 'pharmacyProcurementId', { models })
  const buildQuery = ({
    handOverNumber,
    invoiceNumber,
    invoiceDateStart,
    invoiceDateEnd,
    name,
    priceStart,
    priceEnd,
    totalPriceStart,
    totalPriceEnd,
    taxStart,
    taxEnd,
    taxPercentageStart,
    taxPercentageEnd,
    finalPriceStart,
    finalPriceEnd,
    supplierId,
    currentStateId,
    creatorId,
    validatorId,
    validatedAtStart,
    validatedAtEnd,
  }) => {
    const condition = []

    if (name) {
      condition.push({ name: { [Op.iLike]: `%${name}%` } })
    }
    if (handOverNumber) {
      condition.push({ handOverNumber: { [Op.iLike]: `%${handOverNumber}%` } })
    }
    if (invoiceNumber) {
      condition.push({ invoiceNumber: { [Op.iLike]: `%${invoiceNumber}%` } })
    }
    if (supplierId) {
      condition.push({ supplierId: { [Op.eq]: supplierId } })
    }
    if (currentStateId) {
      condition.push({ currentStateId: { [Op.eq]: currentStateId } })
    }
    if (creatorId) {
      condition.push({ creatorId: { [Op.eq]: creatorId } })
    }
    if (validatorId) {
      condition.push({ validatorId: { [Op.eq]: validatorId } })
    }

    if (invoiceDateStart && invoiceDateEnd) {
      condition.push({
        invoiceDate: { [Op.between]: [invoiceDateStart, invoiceDateEnd] },
      })
    } else if (invoiceDateStart) {
      condition.push({ invoiceDate: { [Op.gte]: invoiceDateStart } })
    }
    if (priceStart && priceEnd) {
      condition.push({
        price: { [Op.between]: [priceStart, priceEnd] },
      })
    } else if (priceStart) {
      condition.push({ price: { [Op.gte]: priceStart } })
    }
    if (totalPriceStart && totalPriceEnd) {
      condition.push({
        totalPrice: { [Op.between]: [totalPriceStart, totalPriceEnd] },
      })
    } else if (totalPriceStart) {
      condition.push({ totalPrice: { [Op.gte]: totalPriceStart } })
    }
    if (taxStart && taxEnd) {
      condition.push({
        tax: { [Op.between]: [taxStart, taxEnd] },
      })
    } else if (taxStart) {
      condition.push({ tax: { [Op.gte]: taxStart } })
    }
    if (taxPercentageStart && taxPercentageEnd) {
      condition.push({
        taxPercentage: { [Op.between]: [taxPercentageStart, taxPercentageEnd] },
      })
    } else if (taxPercentageStart) {
      condition.push({ taxPercentage: { [Op.gte]: taxPercentageStart } })
    }
    if (finalPriceStart && finalPriceEnd) {
      condition.push({
        finalPrice: { [Op.between]: [finalPriceStart, finalPriceEnd] },
      })
    } else if (finalPriceStart) {
      condition.push({ finalPrice: { [Op.gte]: finalPriceStart } })
    }
    if (validatedAtStart && validatedAtEnd) {
      condition.push({
        validatedAt: { [Op.between]: [validatedAtStart, validatedAtEnd] },
      })
    } else if (validatedAtStart) {
      condition.push({ validatedAt: { [Op.gte]: validatedAtStart } })
    }

    return condition
  }

  const parseRelations = (relations = {}) => {
    const include = []
    const { Supplier, User, State, Profile, PharmacyProcurementLog } = models
    const {
      withSupplier,
      withCreator,
      withValidator,
      withCurrentState,
      withLogs,
    } = relations

    if (withSupplier) {
      include.push({
        model: Supplier,
        as: 'supplier',
        attributes: { exclude: ['createdAt', 'updatedAt', 'deletedAt'] },
      })
    }
    if (withCreator) {
      include.push({
        model: User,
        as: 'creator',
        attributes: { exclude: ['createdAt', 'updatedAt', 'deletedAt'] },
        include: {
          model: Profile,
          as: 'profile',
          attributes: { exclude: ['createdAt', 'updatedAt', 'deletedAt'] },
        },
      })
    }
    if (withValidator) {
      include.push({
        model: User,
        as: 'validator',
        attributes: { exclude: ['createdAt', 'updatedAt', 'deletedAt'] },
        include: {
          model: Profile,
          as: 'profile',
          attributes: { exclude: ['createdAt', 'updatedAt', 'deletedAt'] },
        },
      })
    }
    if (withCurrentState) {
      include.push({
        model: State,
        as: 'state',
        attributes: { exclude: ['createdAt', 'updatedAt', 'deletedAt'] },
      })
    }
    if (withLogs) {
      include.push({
        model: PharmacyProcurementLog,
        as: 'pharmacyProcurementLogs',
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
