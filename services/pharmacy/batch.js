const { Op } = require('sequelize')
const JoiDateClass = require('@joi/date')
const Joi = require('joi')
const JoiDate = Joi.extend(JoiDateClass)
const handler = require('../base')

const { ErrorUtil, PaginationUtil } = require('../../internal/utils')
const { sequelize } = require('../../infra/postgre')

const joiQueries = {
  code: Joi.string().optional(),
  name: Joi.string().optional(),
  dateOrderStart: JoiDate.date().format('DD-MM-YYYY').optional(),
  dateOrderEnd: JoiDate.date().format('DD-MM-YYYY').optional(),
  dateReceivedStart: JoiDate.date().format('DD-MM-YYYY').optional(),
  dateReceivedEnd: JoiDate.date().format('DD-MM-YYYY').optional(),
}
const joiParams = {}
const joiCreatePayload = {
  name: Joi.string().required(),
  code: Joi.string().optional().allow('', null),
  dateOrder: JoiDate.date().format('DD-MM-YYYY').optional().allow(null),
  dateReceived: JoiDate.date().format('DD-MM-YYYY').optional().allow(null),
}
const joiEditPayload = {
  name: Joi.string().optional(),
  code: Joi.string().optional().allow('', null),
  dateOrder: JoiDate.date().format('DD-MM-YYYY').optional().allow(null),
  dateReceived: JoiDate.date().format('DD-MM-YYYY').optional().allow(null),
}

module.exports = ({ models }) => {
  const h = handler('Batch', 'batchId', { models })
  const buildQuery = ({
    code,
    name,
    dateOrderStart,
    dateOrderEnd,
    dateReceivedStart,
    dateReceivedEnd,
  }) => {
    const condition = []

    if (code) {
      condition.push({ code: { [Op.iLike]: `%${code}%` } })
    }

    if (name) {
      condition.push({ name: { [Op.iLike]: `%${name}%` } })
    }

    if (dateOrderStart && dateOrderEnd) {
      condition.push({
        dateOrder: { [Op.between]: [dateOrderStart, dateOrderEnd] },
      })
    } else if (dateOrderStart) {
      condition.push({ dateOrder: { [Op.gte]: dateOrderStart } })
    }

    if (dateReceivedStart && dateReceivedEnd) {
      condition.push({
        dateReceived: { [Op.between]: [dateReceivedStart, dateReceivedEnd] },
      })
    } else if (dateReceivedStart) {
      condition.push({ dateReceived: { [Op.gte]: dateReceivedStart } })
    }

    return condition
  }

  const parseRelations = (relations = {}) => {
    const include = []
    const { Medicine, PharmacyPool, MedicineBatchPharmacyPoolStock, Batch } =
      models
    // const { withMedicines } = relations

    // if (withMedicines) {
    //   include.push({
    //     model: Medicine,
    //     as: 'medicines',
    //     attributes: { exclude: ['createdAt', 'updatedAt', 'deletedAt'] },
    //     through: {
    //       attributes: [
    //         'purchasePrice',
    //         'sellPrice',
    //         'tax',
    //         'taxPercentage',
    //         'quantityReceived',
    //         'quantityReceivedUom',
    //         'currentQuantity',
    //         'expiredAt',
    //       ],
    //     },
    //   })
    // }

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
