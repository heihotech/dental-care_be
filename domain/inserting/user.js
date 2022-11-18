const { ResponseUtil } = require('../../internal/utils')

const handler = ({ permissionService, userService, roleService }) => {
  return {
    InsertPermissionsToUser: async (req, res, next) => {
      try {
        await userService.ValidateId(req.params)

        if (
          !req.body ||
          !req.body.permissions ||
          req.body.permissions.length < 1
        ) {
          throw new Error('harap isi data permissions')
        }

        const data = await permissionService.AssignPermissionsToUser(
          req.body.permissions,
          req.params.userId
        )

        res.send(ResponseUtil.RespJSONOk(data))
      } catch (err) {
        next(err)
      }
    },
    InsertRolesAndPermissionsToUser: async (req, res, next) => {
      try {
        if (!req.body || !req.body.roles || req.body.roles.length < 1) {
          throw new Error('harap isi data roles')
        }

        await userService.ValidateId(req.params)
        await Promise.all(
          req.body.roles.map(async (roleId) => {
            let content = { roleId: roleId }

            await roleService.ValidateId(content)
          })
        )

        await permissionService.AssignPermissionsToUserByRoleIds(
          req.body.roles,
          req.params.userId
        )

        const data = await roleService.AssignRolesToUser(
          req.body.roles,
          req.params.userId
        )

        res.send(ResponseUtil.RespJSONOk(data))
      } catch (err) {
        next(err)
      }
    },
    RemoveRolesFromUser: async (req, res, next) => {
      try {
        if (!req.body || !req.body.roles || req.body.roles.length < 1) {
          throw new Error('harap isi data roles')
        }

        await userService.ValidateId(req.params)
        await Promise.all(
          req.body.roles.map(async (roleId) => {
            let content = { roleId: roleId }

            await roleService.ValidateId(content)
          })
        )

        const data = await roleService.RemoveRolesFromUser(
          req.body.roles,
          req.params.userId
        )

        res.send(ResponseUtil.RespJSONOk(data))
      } catch (err) {
        next(err)
      }
    },
    RemoveAllRolesAndAssignNewRolesToUser: async (req, res, next) => {
      try {
        if (!req.body || !req.body.roles || req.body.roles.length < 1) {
          throw new Error('harap isi data roles')
        }

        await userService.ValidateId(req.params)
        await Promise.all(
          req.body.roles.map(async (roleId) => {
            let content = { roleId: roleId }

            await roleService.ValidateId(content)
          })
        )

        const data = await roleService.RemoveAllRolesAssignRolesToUser(
          req.body.roles,
          req.params.userId
        )

        res.send(ResponseUtil.RespJSONOk(data))
      } catch (err) {
        next(err)
      }
    },
  }
}

module.exports = ({
  httpTool,
  permissionService,
  userService,
  roleService,
}) => {
  const { httpRouter, middleware } = httpTool
  const h = handler({
    permissionService,
    userService,
    roleService,
  })

  httpRouter.post(
    '/api/users/:userId/permissions',
    [middleware.JWTAuth],
    h.InsertPermissionsToUser
  )
  httpRouter.post(
    '/api/users/:userId/insert-roles',
    [middleware.JWTAuth],
    h.InsertRolesAndPermissionsToUser
  )
  httpRouter.post(
    '/api/users/:userId/remove-all-roles-and-insert-roles',
    [middleware.JWTAuth],
    h.RemoveAllRolesAndAssignNewRolesToUser
  )
}
