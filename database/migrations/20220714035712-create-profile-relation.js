'use strict'
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('profile_relations', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.BIGINT,
        autoIncrement: true,
      },
      profile_id: {
        type: Sequelize.BIGINT,
        references: {
          model: 'profiles',
          key: 'id',
        },
      },
      related_profile_id: {
        type: Sequelize.BIGINT,
        references: {
          model: 'profiles',
          key: 'id',
        },
      },
      relation_type: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      deleted_at: {
        allowNull: true,
        type: Sequelize.DATE,
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    })
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('profile_relations')
  },
}
