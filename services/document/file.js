const { Op } = require('sequelize')
const Joi = require('joi')
const handler = require('../base')
const { sequelize } = require('../../infra/postgre')

const joiQueries = {
  name: Joi.string().optional(),
  description: Joi.string().optional(),
  type: Joi.string().optional(),
  fileUrl: Joi.string().optional(),
  shareUrl: Joi.string().optional(),
  folderId: Joi.number().optional(),
  creatorId: Joi.string().optional(),
  withRoles: Joi.bool().optional().default(false),
  withUsers: Joi.bool().optional().default(false),
  withCreator: Joi.bool().optional().default(false),
  withPath: Joi.bool().optional().default(false),
  withTags: Joi.bool().optional().default(false),
}
const joiParams = {
  withRoles: Joi.bool().optional().default(false),
  withUsers: Joi.bool().optional().default(false),
  withCreator: Joi.bool().optional().default(false),
  withPath: Joi.bool().optional().default(false),
  withTags: Joi.bool().optional().default(false),
}
const joiCreatePayload = {
  name: Joi.string().required(),
  description: Joi.string().optional().allow(null, ''),
  size: Joi.number().optional().allow(null),
  type: Joi.string().optional().allow(null),
  password: Joi.string().optional().allow(null),
  fileUrl: Joi.string().optional().allow(null),
  shareUrl: Joi.string().optional().allow(null),
  folderId: Joi.number().required().allow(null),
  creatorId: Joi.number().required(),
}
const joiEditPayload = {
  name: Joi.string().optional(),
  description: Joi.string().optional(),
  size: Joi.number().optional(),
  type: Joi.string().optional(),
  password: Joi.string().optional(),
  fileUrl: Joi.string().optional(),
  shareUrl: Joi.string().optional(),
  folderId: Joi.number().optional(),
  creatorId: Joi.number().optional(),
}

module.exports = ({ models }) => {
  const h = handler('File', 'fileId', { models })

  // const countSubFolders = {
  //   query:
  //     '(SELECT COUNT(*) FROM "folders" WHERE "folders"."parent_id" = "Folder"."id")',
  //   attribute: 'subFoldersCount',
  // }
  // const countFiles = {
  //   query:
  //     '(SELECT COUNT(*) FROM "files" WHERE "files"."folder_id" = "Folder"."id")',
  //   attribute: 'filesCount',
  // }

  const buildQuery = ({
    name,
    description,
    type,
    fileUrl,
    shareUrl,
    folderId,
    creatorId,
  }) => {
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
    if (type) {
      condition.push({
        type: { [Op.eq]: type },
      })
    }
    if (fileUrl) {
      condition.push({
        fileUrl: { [Op.eq]: fileUrl },
      })
    }
    if (shareUrl) {
      condition.push({
        shareUrl: { [Op.eq]: shareUrl },
      })
    }
    if (folderId) {
      condition.push({
        folderId: { [Op.eq]: folderId },
      })
    } else if (!folderId) {
      condition.push({
        folderId: { [Op.is]: null },
      })
    }
    if (creatorId) {
      condition.push({
        creatorId: { [Op.eq]: creatorId },
      })
    }

    return condition
  }

  const parseRelations = (relations = {}) => {
    const include = []
    const { Folder, Tag, User, Role } = models
    const { withRoles, withUsers, withCreator, withPath, withTags } = relations

    if (withRoles) {
      include.push({
        model: Role,
        as: 'fileGrantedRoles',
        attributes: { exclude: ['createdAt', 'updatedAt', 'deletedAt'] },
        through: { attributes: [] },
      })
    }
    if (withUsers) {
      include.push({
        model: User,
        as: 'fileGrantedUsers',
        attributes: { exclude: ['createdAt', 'updatedAt', 'deletedAt'] },
        through: { attributes: [] },
      })
    }
    if (withCreator) {
      include.push({
        model: User,
        as: 'creator',
        attributes: { exclude: ['createdAt', 'updatedAt', 'deletedAt'] },
      })
    }
    if (withTags) {
      include.push({
        model: Tag,
        as: 'tags',
        attributes: { exclude: ['createdAt', 'updatedAt', 'deletedAt'] },
        through: { attributes: [] },
      })
    }

    include.push({
      model: Folder,
      as: 'folder',
      attributes: { exclude: ['createdAt', 'updatedAt', 'deletedAt'] },
    })

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
    await h.GetAll(parseRelations(query), buildQuery(query), query, [], [])

  const GetOne = async (params, query) =>
    await h.GetOne(params, parseRelations(query), query)

  const Delete = async (params, force) => await h.Delete(params, force)

  const Restore = async (params) => await h.Restore(params)

  const Create = async (payload) => await h.Create(payload)

  const Update = async (params, payload) => await h.Update(params, payload)

  const InjectActor = async (payload, user, as) =>
    await h.InjectActor(payload, user, as)

  const Insert = async (params, payload, model) => {
    switch (model) {
      case 'roles':
        await InsertRoles(params, payload)
        break
      case 'users':
        await InsertUsers(params, payload)
        break
      case 'tags':
        await InsertTags(params, payload)
        break

      default:
        break
    }
  }

  const InsertRoles = async (params, payload) =>
    await h.Insert({
      payload: payload,
      modelFrom: 'Role',
      modelFromAttribute: 'roleId',
      modelToAttribute: 'fileId',
      modelThrough: 'FileRole',
      params: params,
    })

  const InsertUsers = async (params, payload) =>
    await h.Insert({
      payload: payload,
      modelFrom: 'User',
      modelFromAttribute: 'userId',
      modelToAttribute: 'fileId',
      modelThrough: 'FileUser',
      params: params,
    })

  const InsertTags = async (params, payload) =>
    await h.Insert({
      payload: payload,
      modelFrom: 'Tag',
      modelFromAttribute: 'tagId',
      modelToAttribute: 'fileId',
      modelThrough: 'FileTag',
      params: params,
    })

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
    Insert,
  }
}
