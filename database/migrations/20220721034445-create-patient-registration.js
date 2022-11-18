'use strict'
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('patient_registrations', {
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
      bpjs_number: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      phone_number: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      email: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      full_name: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      front_title: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      end_title: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      nik: {
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
      is_indonesian: {
        allowNull: true,
        type: Sequelize.BOOLEAN,
      },
      address_id: {
        allowNull: true,
        type: Sequelize.BIGINT,
        references: {
          model: 'addresses',
          key: 'id',
        },
      },
      validator: {
        allowNull: true,
        type: Sequelize.BIGINT,
        references: {
          model: 'users',
          key: 'id',
        },
      },
      validated_at: {
        allowNull: true,
        type: Sequelize.DATE,
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
    await queryInterface.dropTable('patient_registrations')
  },
}
