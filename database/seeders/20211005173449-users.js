const { v4: uuidv4 } = require('uuid')
const users = require('./sources/users')
module.exports = {
  up: async (queryInterface, Sequelize) => {
    let payloadUsers = []
    let payloadUserRoles = []
    let rolesToAdd = []
    for (const el of users) {
      const profile = await queryInterface.rawSelect(
        'profiles',
        {
          where: {
            full_name: el.full_name,
          },
        },
        ['id']
      )

      if (el.roles) {
        for (const roleItem of el.roles) {
          const role = await queryInterface.rawSelect(
            'roles',
            {
              where: {
                name: roleItem,
              },
            },
            ['id']
          )
          if (role) {
            rolesToAdd.push({
              profile_id: profile,
              role_id: role,
            })
          }
        }
      }

      if (profile) {
        delete el.roles
        delete el.full_name

        payloadUsers.push({
          ...el,
          profile_id: profile,
        })
      }
    }

    await queryInterface.bulkInsert('users', payloadUsers)

    if (rolesToAdd.length > 0) {
      for (const userRole of rolesToAdd) {
        const user = await queryInterface.rawSelect(
          'users',
          {
            where: {
              profile_id: userRole.profile_id,
            },
          },
          ['id']
        )

        if (user) {
          payloadUserRoles.push({
            user_id: user,
            role_id: userRole.role_id,
            created_at: new Date(),
            updated_at: new Date(),
          })
        }
      }
    }

    return await queryInterface.bulkInsert('user_roles', payloadUserRoles)
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('user_roles', null, {})
    return await queryInterface.bulkDelete('users', null, {})
  },
}
