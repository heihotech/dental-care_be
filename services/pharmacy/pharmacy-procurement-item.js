const { Op } = require('sequelize')
const JoiDateClass = require('@joi/date')
const Joi = require('joi')
const JoiDate = Joi.extend(JoiDateClass)
const handler = require('../base')

const { ErrorUtil, PaginationUtil } = require('../../internal/utils')
const { sequelize } = require('../../infra/postgre')

const joiQueries = {
  invoiceNumber: Joi.string().optional().allow('', null),
  handOverNumber: Joi.string().optional().allow('', null),
  salesName: Joi.string().optional().allow('', null),
  batchId: Joi.number().optional().allow(null),
  medicineId: Joi.number().optional().allow(null),
  supplierId: Joi.number().optional().allow(null),
  pharmacyProcurementId: Joi.number().optional().allow(null),
  currentStateId: Joi.number().optional().allow(null),
  uom: Joi.string().optional(),
  creatorId: Joi.number().optional().allow(null),
  validatorId: Joi.number().optional().allow(null),
  receiverId: Joi.number().optional().allow(null),

  invoiceDateStart: JoiDate.date().format('DD-MM-YYYY').optional(),
  invoiceDateEnd: JoiDate.date().format('DD-MM-YYYY').optional(),
  expiredAtStart: JoiDate.date().format('DD-MM-YYYY').optional(),
  expiredAtEnd: JoiDate.date().format('DD-MM-YYYY').optional(),
  receivedAtStart: JoiDate.date().format('DD-MM-YYYY').optional(),
  receivedAtEnd: JoiDate.date().format('DD-MM-YYYY').optional(),
  validatedAtStart: JoiDate.date().optional(),
  validatedAtEnd: JoiDate.date().optional(),

  quantityStart: Joi.number().optional(),
  quantityEnd: Joi.number().optional(),
  quantityReceivedStart: Joi.number().optional().allow('', null),
  quantityReceivedEnd: Joi.number().optional().allow('', null),
  quantityReturnedStart: Joi.number().optional().allow('', null),
  quantityReturnedEnd: Joi.number().optional().allow('', null),
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

  withBatch: Joi.bool().optional().default(false),
  withMedicine: Joi.bool().optional().default(false),
  withSupplier: Joi.bool().optional().default(false),
  withPharmacyProcurement: Joi.bool().optional().default(false),
  withCurrentState: Joi.bool().optional().default(false),
  withCreator: Joi.bool().optional().default(false),
  withValidator: Joi.bool().optional().default(false),
  withReceiver: Joi.bool().optional().default(false),
}
const joiParams = {
  withBatch: Joi.bool().optional().default(false),
  withMedicine: Joi.bool().optional().default(false),
  withSupplier: Joi.bool().optional().default(false),
  withPharmacyProcurement: Joi.bool().optional().default(false),
  withCurrentState: Joi.bool().optional().default(false),
  withCreator: Joi.bool().optional().default(false),
  withValidator: Joi.bool().optional().default(false),
  withReceiver: Joi.bool().optional().default(false),
}
const joiCreatePayload = {
  invoiceNumber: Joi.string().optional().allow('', null),
  invoiceDate: JoiDate.date().format('DD-MM-YYYY').optional(),
  invoiceUrl: Joi.string().optional().allow('', null),
  handOverNumber: Joi.string().optional().allow('', null),
  handOverUrl: Joi.string().optional().allow('', null),
  salesName: Joi.string().optional().allow('', null),
  batchId: Joi.number().optional().allow(null),
  medicineId: Joi.number().optional().allow(null),
  supplierId: Joi.number().optional().allow(null),
  pharmacyProcurementId: Joi.number().optional().allow(null),
  currentStateId: Joi.number().optional().allow(null),
  quantity: Joi.number().required(),
  uom: Joi.string().required(),
  quantityReceived: Joi.number().optional().allow('', null),
  quantityReturned: Joi.number().optional().allow('', null),
  price: Joi.number().required(),
  totalPrice: Joi.number().required(),
  tax: Joi.number().required(),
  taxPercentage: Joi.number().required(),
  finalPrice: Joi.number().required(),
  creatorId: Joi.number().optional().allow(null),
  validatorId: Joi.number().optional().allow(null),
  receiverId: Joi.number().optional().allow(null),
  expiredAt: JoiDate.date().format('DD-MM-YYYY').optional(),
  receivedAt: JoiDate.date().format('DD-MM-YYYY').optional(),
  validatedAt: JoiDate.date().optional(),
}
const joiEditPayload = {
  invoiceNumber: Joi.string().optional().allow('', null),
  invoiceDate: JoiDate.date().format('DD-MM-YYYY').optional(),
  invoiceUrl: Joi.string().optional().allow('', null),
  handOverNumber: Joi.string().optional().allow('', null),
  handOverUrl: Joi.string().optional().allow('', null),
  salesName: Joi.string().optional().allow('', null),
  batchId: Joi.number().optional().allow(null),
  medicineId: Joi.number().optional().allow(null),
  supplierId: Joi.number().optional().allow(null),
  pharmacyProcurementId: Joi.number().optional().allow(null),
  currentStateId: Joi.number().optional().allow(null),
  quantity: Joi.number().optional(),
  uom: Joi.string().optional(),
  quantityReceived: Joi.number().optional().allow('', null),
  quantityReturned: Joi.number().optional().allow('', null),
  price: Joi.number().optional(),
  totalPrice: Joi.number().optional(),
  tax: Joi.number().optional(),
  taxPercentage: Joi.number().optional(),
  finalPrice: Joi.number().optional(),
  creatorId: Joi.number().optional().allow(null),
  validatorId: Joi.number().optional().allow(null),
  receiverId: Joi.number().optional().allow(null),
  expiredAt: JoiDate.date().format('DD-MM-YYYY').optional(),
  receivedAt: JoiDate.date().format('DD-MM-YYYY').optional(),
  validatedAt: JoiDate.date().optional(),
}

module.exports = ({ models }) => {
  const h = handler('PharmacyProcurementItem', 'pharmacyProcurementItemId', {
    models,
  })
  const buildQuery = ({
    invoiceNumber,
    handOverNumber,
    salesName,
    batchId,
    medicineId,
    supplierId,
    pharmacyProcurementId,
    currentStateId,
    uom,
    creatorId,
    validatorId,
    receiverId,
    invoiceDateStart,
    invoiceDateEnd,
    expiredAtStart,
    expiredAtEnd,
    receivedAtStart,
    receivedAtEnd,
    validatedAtStart,
    validatedAtEnd,
    quantityStart,
    quantityEnd,
    quantityReceivedStart,
    quantityReceivedEnd,
    quantityReturnedStart,
    quantityReturnedEnd,
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
  }) => {
    const condition = []

    if (uom) {
      condition.push({ uom: { [Op.iLike]: `%${uom}%` } })
    }
    if (salesName) {
      condition.push({ salesName: { [Op.iLike]: `%${salesName}%` } })
    }
    if (handOverNumber) {
      condition.push({ handOverNumber: { [Op.iLike]: `%${handOverNumber}%` } })
    }
    if (invoiceNumber) {
      condition.push({ invoiceNumber: { [Op.iLike]: `%${invoiceNumber}%` } })
    }
    if (receiverId) {
      condition.push({ receiverId: { [Op.eq]: receiverId } })
    }
    if (supplierId) {
      condition.push({ supplierId: { [Op.eq]: supplierId } })
    }
    if (batchId) {
      condition.push({ batchId: { [Op.eq]: batchId } })
    }
    if (pharmacyProcurementId) {
      condition.push({
        pharmacyProcurementId: { [Op.eq]: pharmacyProcurementId },
      })
    }
    if (medicineId) {
      condition.push({ medicineId: { [Op.eq]: medicineId } })
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

    if (quantityStart && quantityEnd) {
      condition.push({
        quantity: { [Op.between]: [quantityStart, quantityEnd] },
      })
    } else if (quantityStart) {
      condition.push({ quantity: { [Op.gte]: quantityStart } })
    }
    if (quantityReceivedStart && quantityReceivedEnd) {
      condition.push({
        quantityReceived: {
          [Op.between]: [quantityReceivedStart, quantityReceivedEnd],
        },
      })
    } else if (quantityReceivedStart) {
      condition.push({ quantityReceived: { [Op.gte]: quantityReceivedStart } })
    }
    if (quantityReturnedStart && quantityReturnedEnd) {
      condition.push({
        quantityReturned: {
          [Op.between]: [quantityReturnedStart, quantityReturnedEnd],
        },
      })
    } else if (quantityReturnedStart) {
      condition.push({ quantityReturned: { [Op.gte]: quantityReturnedStart } })
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
    if (expiredAtStart && expiredAtEnd) {
      condition.push({
        expiredAt: { [Op.between]: [expiredAtStart, expiredAtEnd] },
      })
    } else if (expiredAtStart) {
      condition.push({ expiredAt: { [Op.gte]: expiredAtStart } })
    }
    if (receivedAtStart && receivedAtEnd) {
      condition.push({
        receivedAt: { [Op.between]: [receivedAtStart, receivedAtEnd] },
      })
    } else if (receivedAtStart) {
      condition.push({ receivedAt: { [Op.gte]: receivedAtStart } })
    }

    return condition
  }

  const parseRelations = (relations = {}) => {
    const include = []
    const {
      Supplier,
      User,
      State,
      Profile,
      Batch,
      Medicine,
      PharmacyProcurement,
    } = models
    const {
      withBatch,
      withMedicine,
      withSupplier,
      withPharmacyProcurement,
      withCurrentState,
      withCreator,
      withValidator,
      withReceiver,
    } = relations

    if (withPharmacyProcurement) {
      include.push({
        model: PharmacyProcurement,
        as: 'pharmacyProcurementItem',
        attributes: { exclude: ['createdAt', 'updatedAt', 'deletedAt'] },
      })
    }
    if (withMedicine) {
      include.push({
        model: Medicine,
        as: 'medicine',
        attributes: { exclude: ['createdAt', 'updatedAt', 'deletedAt'] },
      })
    }
    if (withBatch) {
      include.push({
        model: Batch,
        as: 'batch',
        attributes: { exclude: ['createdAt', 'updatedAt', 'deletedAt'] },
      })
    }
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
    if (withReceiver) {
      include.push({
        model: User,
        as: 'receiver',
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
