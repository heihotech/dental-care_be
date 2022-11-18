const { Op } = require('sequelize')
const JoiDateClass = require('@joi/date')
const Joi = require('joi')
const JoiDate = Joi.extend(JoiDateClass)
const handler = require('../base')

const { ErrorUtil, PaginationUtil } = require('../../internal/utils')
const { sequelize } = require('../../infra/postgre')

const joiQueries = {
  barCode: Joi.string().optional(),
  name: Joi.string().optional(),
  mainCompositionMgStart: Joi.number().optional(),
  mainCompositionMgEnd: Joi.number().optional(),
  form: Joi.number().optional(),
  type: Joi.string().optional(),
  className: Joi.string().optional(),
  description: Joi.string().optional(),
  isConsumable: Joi.bool().optional(),
  isSearchable: Joi.bool().optional(),
  isGeneric: Joi.bool().optional(),
  isConcoction: Joi.bool().optional(),
  supplierId: Joi.number().optional(),

  withPackagesComponents: Joi.bool().optional().default(false),
}
const joiParams = {
  withPackagesComponents: Joi.bool().optional().default(false),
}
const joiCreatePayload = {
  barCode: Joi.string().optional().allow('', null),
  name: Joi.string().required(),
  mainCompositionMg: Joi.number().required(),
  form: Joi.number().required(),
  type: Joi.string().required(),
  className: Joi.string().required(),
  description: Joi.string().required(),
  isConsumable: Joi.bool().required().default(false),
  isSearchable: Joi.bool().required().default(true),
  isGeneric: Joi.bool().required().default(true),
  isConcoction: Joi.bool().required().default(false),
  supplierId: Joi.number().optional().allow(null),
}
const joiEditPayload = {
  barCode: Joi.string().optional().allow('', null),
  name: Joi.string().optional(),
  mainCompositionMg: Joi.number().optional(),
  form: Joi.number().optional(),
  type: Joi.string().optional(),
  className: Joi.string().optional(),
  description: Joi.string().optional(),
  isConsumable: Joi.bool().optional().default(false),
  isSearchable: Joi.bool().optional().default(true),
  isGeneric: Joi.bool().optional().default(true),
  isConcoction: Joi.bool().optional().default(false),
  supplierId: Joi.number().optional().allow(null),
}
const joiCreateMedicinePackagePayload = {
  barCode: Joi.string().optional().allow(null),
  name: Joi.string().required(),
  mainCompositionMg: Joi.number().required(),
  form: Joi.number().required(),
  type: Joi.string().optional().allow(null),
  className: Joi.string().optional().allow(null),
  description: Joi.string().optional().allow(null),
  isConsumable: Joi.bool().required(),
  isSearchable: Joi.bool().required(),
  isGeneric: Joi.bool().required(),
  isConcoction: Joi.bool().required().default(true),
  supplierId: Joi.number().optional().allow(null),
  components: Joi.array().required().min(1).items(Joi.number()),
}
const joiEditMedicinePackagePayload = {
  barCode: Joi.string().optional().allow(null),
  name: Joi.string().optional(),
  mainCompositionMg: Joi.number().optional(),
  form: Joi.number().optional(),
  type: Joi.string().optional().allow(null),
  className: Joi.string().optional().allow(null),
  description: Joi.string().optional().allow(null),
  isConsumable: Joi.bool().optional(),
  isSearchable: Joi.bool().optional(),
  isGeneric: Joi.bool().optional(),
  isConcoction: Joi.bool().optional(),
  supplierId: Joi.number().optional().allow(null),
  components: Joi.array().required().min(1).items(Joi.number()),
}

module.exports = ({ models }) => {
  const h = handler('Medicine', 'medicineId', { models })
  const buildQuery = ({
    barCode,
    name,
    mainCompositionMgStart,
    mainCompositionMgEnd,
    form,
    type,
    className,
    description,
    isConsumable,
    isSearchable,
    isGeneric,
    isConcoction,
    supplierId,
  }) => {
    const condition = []

    if (barCode) {
      condition.push({ barCode: { [Op.iLike]: `%${barCode}%` } })
    }

    if (name) {
      condition.push({ name: { [Op.iLike]: `%${name}%` } })
    }

    if (uom) {
      condition.push({ uom: { [Op.iLike]: `%${uom}%` } })
    }

    if (form) {
      condition.push({ form: { [Op.eq]: form } })
    }

    if (type) {
      condition.push({ type: { [Op.iLike]: `%${type}%` } })
    }

    if (className) {
      condition.push({ className: { [Op.iLike]: `%${className}%` } })
    }

    if (description) {
      condition.push({ description: { [Op.iLike]: `%${description}%` } })
    }

    if (isConsumable) {
      condition.push({ isConsumable: { [Op.eq]: isConsumable } })
    }

    if (typeof isSearchable !== 'undefined') {
      condition.push({ isSearchable: { [Op.eq]: isSearchable } })
    }

    if (isGeneric) {
      condition.push({ isGeneric: { [Op.eq]: isGeneric } })
    }

    if (typeof isConcoction !== 'undefined') {
      condition.push({ isConcoction: { [Op.eq]: isConcoction } })
    }

    if (supplierId) {
      condition.push({ supplierId: { [Op.eq]: supplierId } })
    }

    if (mainCompositionMgStart && mainCompositionMgEnd) {
      condition.push({
        mainCompositionMg: {
          [Op.between]: [mainCompositionMgStart, mainCompositionMgEnd],
        },
      })
    } else if (mainCompositionMgStart) {
      condition.push({
        mainCompositionMg: { [Op.gte]: mainCompositionMgStart },
      })
    }

    return condition
  }

  const parseRelations = (relations = {}) => {
    const include = []
    const { Medicine, PharmacyPool, MedicineBatchPharmacyPool, Batch } = models
    const { withPackagesComponents } = relations

    // if (withBatches) {
    //   include.push({
    //     model: Batch,
    //     as: 'batches',
    //     attributes: { exclude: ['createdAt', 'updatedAt', 'deletedAt'] },
    //     include: {
    //       model: PharmacyPool,
    //       as: 'pharmacyPools',
    //       attributes: { exclude: ['createdAt', 'updatedAt', 'deletedAt'] },
    //       through: {
    //         attributes: [
    //           'purchasePrice',
    //           'sellPrice',
    //           'tax',
    //           'taxPercentage',
    //           'quantityReceived',
    //           'quantityReceivedUom',
    //           'currentQuantity',
    //           'uom',
    //           'expiredAt',
    //         ],
    //       },
    //     },
    //   })
    // }

    if (withPackagesComponents) {
      include.push({
        model: Medicine,
        as: 'packageComponents',
        attributes: {
          exclude: ['createdAt', 'updatedAt', 'deletedAt'],
        },
        through: {
          attributes: ['id'],
          as: 'medicinePackage',
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

  const ValidateCreateMedicinePackagePayload = async (body) =>
    await h.ValidatePayload(joiCreateMedicinePackagePayload, body)

  const ValidateEditPayload = async (body) =>
    await h.ValidatePayload(joiEditPayload, body)

  const ValidateEditMedicinePackagePayload = async (body) =>
    await h.ValidatePayload(joiEditMedicinePackagePayload, body)

  const ValidateId = async (params) => await h.ValidateId(params)

  const GetAll = async (query) =>
    await h.GetAll(parseRelations(query), buildQuery(query), query)

  const GetOne = async (params, query) =>
    await h.GetOne(params, parseRelations(query), query)

  const Delete = async (params, force) => await h.Delete(params, force)

  const Restore = async (params) => await h.Restore(params)

  const Create = async (payload) => await h.Create(payload)

  const CreateMedicinePackage = async (payload) => {
    return sequelize.transaction(async (t) => {
      try {
        const createdMedicine = await models.Medicine.create(payload, {
          transaction: t,
        })

        let components = []

        if (payload.components && payload.components.length > 0) {
          components = await models.Medicine.findAll({
            attributes: ['id'],
            where: {
              id: {
                [Op.or]: payload.components,
              },
            },
          })
        }

        if (components.length > 0) {
          const payload = components.map((el) => {
            return {
              medicineId: createdMedicine.id,
              medicineComponentId: el.id,
            }
          })

          await models.MedicinePackage.bulkCreate(payload, { transaction: t })
        }

        return createdMedicine
      } catch (err) {
        t.rollback()

        throw err
      }
    })
  }

  const UpdateMedicinePackage = async (params, payload) => {
    return sequelize.transaction(async (t) => {
      try {
        const updatedData = await models.Medicine.update(payload, {
          where: {
            id: params.medicineId,
          },
          transaction: t,
        })

        await models.MedicinePackage.destroy({
          where: {
            medicineId: params.medicineId,
          },
          force: true,
          transaction: t,
        })

        let components = []

        if (payload.components && payload.components.length > 0) {
          components = await models.Medicine.findAll({
            attributes: ['id'],
            where: {
              id: {
                [Op.or]: payload.components,
              },
            },
          })
        }

        if (components.length > 0) {
          const payload = components.map((el) => {
            return {
              medicineId: params.medicineId,
              medicineComponentId: el.id,
            }
          })

          await models.MedicinePackage.bulkCreate(payload, { transaction: t })
        }

        return updatedData
      } catch (err) {
        t.rollback()

        throw err
      }
    })
  }

  const Update = async (params, payload) => await h.Update(params, payload)

  return {
    ValidateQueries,
    ValidateParams,
    ValidateCreatePayload,
    ValidateCreateMedicinePackagePayload,
    ValidateEditPayload,
    ValidateEditMedicinePackagePayload,
    ValidateId,
    Create,
    CreateMedicinePackage,
    GetAll,
    GetOne,
    Delete,
    Restore,
    Update,
    UpdateMedicinePackage,
  }
}
