const { Op } = require('sequelize')
const Joi = require('joi')
const handler = require('../base')
const { sequelize } = require('../../infra/postgre')

const joiQueries = {
  name: Joi.string().optional(),
  description: Joi.string().optional(),
  parentId: Joi.number().optional().allow(null),
  createdById: Joi.number().optional(),
  withRoles: Joi.bool().optional().default(false),
  withUsers: Joi.bool().optional().default(false),
  withActor: Joi.bool().optional().default(false),
  withTags: Joi.bool().optional().default(false),
}
const joiParams = {
  withRoles: Joi.bool().optional().default(false),
  withUsers: Joi.bool().optional().default(false),
  withActor: Joi.bool().optional().default(false),
  withTags: Joi.bool().optional().default(false),
  withFiles: Joi.bool().optional().default(false),
  withSubFolders: Joi.bool().optional().default(false),
}
const joiCreatePayload = {
  name: Joi.string().required(),
  description: Joi.string().required().allow(null, ''),
  parentId: Joi.number().required().allow(null),
}
const joiEditPayload = {
  name: Joi.string().optional(),
  description: Joi.string().optional(),
  parentId: Joi.number().optional().allow('', null),
  createdById: Joi.number().optional(),
}
const joiInsertPayload = {
  findOrCreate: Joi.bool().optional().default(false),
  deleteAllBefore: Joi.bool().optional().default(false),
  data: Joi.array().required().min(1),
}

module.exports = ({ models }) => {
  const h = handler('Folder', 'folderId', { models })

  const countSubFolders = {
    query:
      '(SELECT COUNT(*) FROM "folders" WHERE "folders"."parent_id" = "Folder"."id")',
    attribute: 'subFoldersCount',
  }
  const countFiles = {
    query:
      '(SELECT COUNT(*) FROM "files" WHERE "files"."folder_id" = "Folder"."id")',
    attribute: 'filesCount',
  }

  const buildQuery = ({ name, description, parentId, createdById }) => {
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
    if (parentId) {
      condition.push({
        parentId: { [Op.eq]: parentId },
      })
    } else if (!parentId) {
      condition.push({
        parentId: { [Op.is]: null },
      })
    }
    if (createdById) {
      condition.push({
        createdById: { [Op.eq]: createdById },
      })
    }

    return condition
  }

  const parseRelations = (relations = {}) => {
    const include = []
    const { Tag, User, Role, Profile, File, Folder } = models
    const {
      withRoles,
      withUsers,
      withActor,
      withTags,
      withFiles,
      withSubFolders,
    } = relations

    if (withRoles) {
      include.push({
        model: Role,
        as: 'folderGrantedRoles',
        attributes: { exclude: ['createdAt', 'updatedAt', 'deletedAt'] },
        through: { attributes: [] },
      })
    }
    if (withUsers) {
      include.push({
        model: User,
        as: 'folderGrantedUsers',
        attributes: {
          exclude: ['createdAt', 'updatedAt', 'deletedAt', 'password'],
        },
        through: { attributes: [] },
        include: {
          model: Profile,
          as: 'profile',
          attributes: {
            exclude: [
              'createdAt',
              'updatedAt',
              'deletedAt',
              'nik',
              'nip',
              'nipType',
              'gender',
              'religion',
              'birthDate',
              'isIndonesian',
              'addressId',
            ],
          },
        },
      })
    }
    if (withActor) {
      include.push({
        model: User,
        as: 'createdBy',
        attributes: {
          exclude: ['createdAt', 'updatedAt', 'deletedAt', 'password'],
        },
        include: {
          model: Profile,
          as: 'profile',
          attributes: {
            exclude: [
              'createdAt',
              'updatedAt',
              'deletedAt',
              'nik',
              'nip',
              'nipType',
              'gender',
              'religion',
              'birthDate',
              'isIndonesian',
              'addressId',
            ],
          },
        },
      })
      include.push({
        model: User,
        as: 'updatedBy',
        attributes: {
          exclude: ['createdAt', 'updatedAt', 'deletedAt', 'password'],
        },
        include: {
          model: Profile,
          as: 'profile',
          attributes: {
            exclude: [
              'createdAt',
              'updatedAt',
              'deletedAt',
              'nik',
              'nip',
              'nipType',
              'gender',
              'religion',
              'birthDate',
              'isIndonesian',
              'addressId',
            ],
          },
        },
      })
      include.push({
        model: User,
        as: 'deletedBy',
        attributes: {
          exclude: ['createdAt', 'updatedAt', 'deletedAt', 'password'],
        },
        include: {
          model: Profile,
          as: 'profile',
          attributes: {
            exclude: [
              'createdAt',
              'updatedAt',
              'deletedAt',
              'nik',
              'nip',
              'nipType',
              'gender',
              'religion',
              'birthDate',
              'isIndonesian',
              'addressId',
            ],
          },
        },
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
    if (withFiles) {
      include.push({
        model: File,
        as: 'files',
        attributes: {
          exclude: ['createdAt', 'updatedAt', 'deletedAt', 'password'],
        },
      })
    }
    if (withSubFolders) {
      include.push({
        model: Folder,
        as: 'subFolders',
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

  const ValidateInsertPayload = async (body) =>
    await h.ValidatePayload(joiInsertPayload, body)

  const ValidateId = async (params) => await h.ValidateId(params)

  const GetAll = async (query) =>
    await h.GetAll(parseRelations(query), buildQuery(query), query, [
      countSubFolders,
      countFiles,
    ])

  const GetOne = async (params, query) =>
    await h.GetOne(params, parseRelations(query), query)

  const GetAllNestedPath = async (params) => {
    const { Folder } = models
    try {
      let resultfolderPath = []

      const getFolderPath = async (id) => {
        const folderPath = await Folder.findByPk(id, {
          attributes: {
            exclude: ['createdAt', 'updatedAt', 'deletedAt'],
          },
        })

        if (folderPath) {
          resultfolderPath.push(folderPath)
          if (folderPath.parentId !== null) {
            await getFolderPath(folderPath.parentId)
          }
        }
      }

      await getFolderPath(params.folderId)

      return resultfolderPath
    } catch (error) {
      throw error
    }
  }

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
      modelToAttribute: 'folderId',
      modelThrough: 'FolderRole',
      params: params,
    })

  const InsertUsers = async (params, payload) =>
    await h.Insert({
      payload: payload,
      modelFrom: 'User',
      modelFromAttribute: 'userId',
      modelToAttribute: 'folderId',
      modelThrough: 'FolderUser',
      params: params,
    })

  const InsertTags = async (params, payload) =>
    await h.Insert({
      payload: payload,
      modelFrom: 'Tag',
      modelFromAttribute: 'tagId',
      modelToAttribute: 'folderId',
      modelThrough: 'FolderTag',
      params: params,
    })

  return {
    ValidateQueries,
    ValidateParams,
    ValidateCreatePayload,
    ValidateEditPayload,
    ValidateInsertPayload,
    ValidateId,
    Create,
    GetAll,
    GetOne,
    GetAllNestedPath,
    Delete,
    Restore,
    Update,
    InjectActor,
    Insert,
  }
}
