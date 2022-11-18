const { Op } = require('sequelize')
const Joi = require('joi')
const handler = require('../base')
const { sequelize } = require('../../infra/postgre')

const joiQueries = {
  name: Joi.string().optional(),
  description: Joi.string().optional(),
  withFolders: Joi.bool().optional().default(false),
  withFiles: Joi.bool().optional().default(false),
}
const joiParams = {
  withFolders: Joi.bool().optional().default(false),
  withFiles: Joi.bool().optional().default(false),
}
const joiCreatePayload = {
  name: Joi.string().required(),
  description: Joi.string().required().allow(null, ''),
}
const joiEditPayload = {
  name: Joi.string().optional(),
  description: Joi.string().optional().allow(null, ''),
}

module.exports = ({ models }) => {
  const h = handler('Tag', 'tagId', { models })

  const countFiles = {
    query:
      '(SELECT COUNT(*) FROM "file_tags" WHERE "file_tags"."tag_id" = "Tag"."id")',
    attribute: 'filesCount',
  }
  const countFolders = {
    query:
      '(SELECT COUNT(*) FROM "folder_tags" WHERE "folder_tags"."tag_id" = "Tag"."id")',
    attribute: 'foldersCount',
  }

  const buildQuery = ({ name, description }) => {
    const condition = []

    if (name) {
      condition.push({
        name: { [Op.iLike]: `%${name}%` },
      })
    }
    if (description) {
      condition.push({
        description: { [Op.iLike]: `%${description}%` },
      })
    }

    return condition
  }

  const parseRelations = (relations = {}) => {
    const include = []
    const { Folder, File } = models
    const { withFiles, withFolders } = relations

    if (withFiles) {
      include.push({
        model: File,
        as: 'files',
        attributes: { exclude: ['createdAt', 'updatedAt', 'deletedAt'] },
        through: { attributes: [] },
      })
    }
    if (withFolders) {
      include.push({
        model: Folder,
        as: 'folders',
        attributes: { exclude: ['createdAt', 'updatedAt', 'deletedAt'] },
        through: { attributes: [] },
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
    await h.GetAll(
      parseRelations(query),
      buildQuery(query),
      query,
      [countFiles, countFolders]
      // countInclude
    )

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
