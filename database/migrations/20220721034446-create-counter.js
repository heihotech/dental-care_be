'use strict'
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('counters', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.BIGINT,
        autoIncrement: true,
      },
      guid: {
        allowNull: false,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
      },
      profile_id: {
        type: Sequelize.BIGINT,
        references: {
          model: 'profiles',
          key: 'id',
        },
      },
      // not null if type clinic
      clinic_id: {
        allowNull: true,
        type: Sequelize.BIGINT,
        references: {
          model: 'clinics',
          key: 'id',
        },
      },
      name: {
        type: Sequelize.STRING,
      },
      voice_title: {
        type: Sequelize.STRING,
      },
      // 1: pendaftaran, 2: nurse station, 3: clinic, 4:...
      counter_type: {
        type: Sequelize.INTEGER,
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
    await queryInterface.dropTable('counters')
  },
}
