'use strict'
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('book_orders', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.BIGINT,
        autoIncrement: true,
      },
      patient_registration_id: {
        allowNull: true,
        type: Sequelize.BIGINT,
        references: {
          model: 'patient_registrations',
          key: 'id',
        },
      },
      doctor_id: {
        allowNull: true,
        type: Sequelize.BIGINT,
        references: {
          model: 'doctors',
          key: 'id',
        },
      },
      clinic_id: {
        allowNull: true,
        type: Sequelize.BIGINT,
        references: {
          model: 'clinics',
          key: 'id',
        },
      },
      book_code: {
        type: Sequelize.STRING,
      },
      qr_book_code: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      qr_book_code_url: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      arrival_estimation: {
        type: Sequelize.DATE,
      },
      // {1 (UMUM), 2 (BPJS PBI), 3 (BPJS NON PBI)}
      patient_type: {
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
    await queryInterface.dropTable('book_orders')
  },
}
