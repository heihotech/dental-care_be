'use strict'
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('profiles', {
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
      full_name: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      nik: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      employee_id: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      gender: {
        allowNull: true,
        type: Sequelize.ENUM('M', 'F'),
        defaultValue: 'F',
      },
      religion: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      birth_date: {
        allowNull: true,
        type: Sequelize.DATEONLY,
      },
      avatar_url: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      address_id: {
        allowNull: true,
        type: Sequelize.BIGINT,
        references: {
          model: 'addresses',
          key: 'id',
        },
      },
      is_indonesian: {
        allowNull: true,
        type: Sequelize.BOOLEAN,
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
    await queryInterface.dropTable('profiles')
  },
}
