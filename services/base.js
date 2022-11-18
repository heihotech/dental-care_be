const { Op } = require('sequelize')
const bcrypt = require('bcryptjs')
const Joi = require('joi')
const { sequelize } = require('../infra/postgre')
const { ErrorUtil, PaginationUtil } = require('../internal/utils')

const handler = (modelName, modelId, { models }) => {
  return {
    ValidateQueries: async (joiQueries, query) => {
      try {
        const validated = await Joi.object(joiQueries)
          .options({ allowUnknown: true })
          .validateAsync(query)
        query.page ? validated.page : (validated.page = 1)
        query.size ? validated.size : (validated.size = 10)
        query.includeDeleted
          ? validated.includeDeleted
          : (validated.includeDeleted = false)
        query.order ? validated.order : (validated.order = 'id:desc')
        return validated
      } catch (err) {
        throw ErrorUtil.ParseJOIError(err)
      }
    },
    ValidateParams: async (joiParams, params) => {
      try {
        const validated = await Joi.object(joiParams)
          .options({ allowUnknown: true })
          .validateAsync(params)

        return validated
      } catch (err) {
        throw ErrorUtil.ParseJOIError(err)
      }
    },
    ValidatePayload: async (joiPayload, body) => {
      try {
        const validated = await Joi.object(joiPayload)
          .options({ allowUnknown: true })
          .validateAsync(body)

        return validated
      } catch (err) {
        throw ErrorUtil.ParseJOIError(err)
      }
    },
    ValidateId: async (params) => {
      try {
        if (!params || !params[modelId]) {
          throw new Error(`perlu data id`)
        }

        const found = await models[modelName].findByPk(params[modelId], {
          paranoid: false,
        })

        if (!found) {
          throw new Error(`id ${modelName} tidak valid`)
        }

        return params
      } catch (err) {
        throw err
      }
    },
    Create: async (payload) => {
      return sequelize.transaction(async (t) => {
        try {
          const created = await models[modelName].create(payload, {
            transaction: t,
          })

          return created
        } catch (err) {
          t.rollback()

          throw err
        }
      })
    },
    GetAll: async (include, condition, query, countInclude, orders) => {
      try {
        const { page, size, includeDeleted, order, noSize } = query
        const { limit, offset, orderField, orderSort } =
          PaginationUtil.GetPagination(page, size, order)
        let newCountInclude = []
        if (countInclude && countInclude.length > 0) {
          await Promise.all(
            countInclude.map((el) => {
              newCountInclude.push([sequelize.literal(el.query), el.attribute])
            })
          )
        }

        const rows = await models[modelName].findAll({
          where: { [Op.and]: condition },
          limit,
          offset,
          order: orders ? orders : [[orderField, orderSort]],
          include,
          paranoid:
            (includeDeleted === 'true' || includeDeleted === true) &&
            includeDeleted != null
              ? false
              : true,
          attributes:
            newCountInclude.length > 0
              ? {
                  include: newCountInclude,
                }
              : {},
        })
        const count = await models[modelName].count({
          where: { [Op.and]: condition },
          paranoid:
            (includeDeleted === 'true' || includeDeleted === true) &&
            includeDeleted != null
              ? false
              : true,
        })

        return {
          data: rows,
          meta: PaginationUtil.BuildMeta(rows.length, count, page, limit),
        }
      } catch (err) {
        throw err
      }
    },
    GetOne: async (params, include, query) => {
      try {
        const { includeDeleted } = query
        const data = await models[modelName].findByPk(params[modelId], {
          include,
          paranoid:
            includeDeleted === 'true' && includeDeleted != null ? false : true,
        })

        return data
      } catch (err) {
        throw err
      }
    },
    Delete: async (params, force) => {
      return sequelize.transaction(async (t) => {
        try {
          const deletedData = await models[modelName].destroy({
            where: {
              id: params[modelId],
            },
            force: force ? force : false,
            transaction: t,
          })

          return deletedData
        } catch (err) {
          t.rollback()

          throw err
        }
      })
    },
    Restore: async (params) => {
      return sequelize.transaction(async (t) => {
        try {
          const restoredData = await models[modelName].restore({
            where: {
              id: params[modelId],
            },
            transaction: t,
          })

          return restoredData
        } catch (err) {
          t.rollback()

          throw err
        }
      })
    },
    Update: async (params, payload) => {
      return sequelize.transaction(async (t) => {
        try {
          const updatedData = await models[modelName].update(payload, {
            where: {
              id: params[modelId],
            },
            transaction: t,
          })

          return updatedData
        } catch (err) {
          t.rollback()

          throw err
        }
      })
    },
    InjectActor: async (payload, user, as) => {
      try {
        const validated = payload

        switch (as) {
          case 'create':
            validated['createdById'] = user.id
            break
          case 'update':
            validated['updatedById'] = user.id
            break
          case 'delete':
            validated['deletedById'] = user.id
            break

          default:
            break
        }

        return validated
      } catch (err) {
        throw err
      }
    },
    // {
    //   findOrCreate: true,
    //   deleteAllBefore: true,
    //   data: []
    // }
    Insert: async ({
      payload,
      modelFrom,
      modelFromAttribute,
      modelToAttribute,
      modelThrough,
      params,
    }) => {
      try {
        let fromIds = []

        return sequelize.transaction(async (t) => {
          if (payload.findOrCreate && payload.findOrCreate === true) {
            await Promise.all(
              payload.data.map(async (el) => {
                const { additionalAttribute, ...newEl } = el
                const [objFrom, created] = await models[modelFrom].findOrCreate(
                  {
                    where: newEl,
                  }
                )

                if (objFrom) {
                  if (additionalAttribute && additionalAttribute !== null) {
                    fromIds.push({
                      id: parseInt(objFrom.id),
                      additionalAttribute,
                    })
                  } else {
                    fromIds.push({ id: parseInt(objFrom.id) })
                  }
                }
              })
            )
          } else {
            await Promise.all(
              payload.data.map(async (el) => {
                const { additionalAttribute, ...newEl } = el
                const objFrom = await models[modelFrom].findAll({
                  where: newEl,
                })

                if (objFrom) {
                  await Promise.all(
                    objFrom.map((obj) => {
                      if (additionalAttribute && additionalAttribute !== null) {
                        fromIds.push({
                          id: parseInt(obj.id),
                          additionalAttribute,
                        })
                      } else {
                        fromIds.push({ id: parseInt(obj.id) })
                      }
                      // fromIds.push(parseInt(obj.id))
                    })
                  )
                }
              })
            )
          }

          if (payload.deleteAllBefore && payload.deleteAllBefore === true) {
            await Promise.all(
              fromIds.map(async (el) => {
                await models[modelThrough].destroy({
                  where: {
                    [modelToAttribute]: parseInt(params[modelId]),
                  },
                  force: true,
                  transaction: t,
                })
              })
            )
          }

          return await Promise.all(
            fromIds.map(async (el) => {
              if (el.additionalAttribute && el.additionalAttribute !== null) {
                await models[modelThrough].create(
                  {
                    [modelFromAttribute]: el.id,
                    [modelToAttribute]: params[modelId],
                    [el.additionalAttribute.key]: el.additionalAttribute.value,
                  },
                  {
                    transaction: t,
                  }
                )
              } else {
                await models[modelThrough].create(
                  {
                    [modelFromAttribute]: el.id,
                    [modelToAttribute]: params[modelId],
                  },
                  {
                    transaction: t,
                  }
                )
              }
            })
          )
        })
      } catch (err) {
        throw err
      }
    },
  }
}

module.exports = handler
