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
      patient_id: {
        allowNull: true,
        type: Sequelize.BIGINT,
        references: {
          model: 'patients',
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
      arrival_plan: {
        type: Sequelize.DATEONLY,
        allowNull: true,
      },
      arrival_estimation: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      arrival: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      patient_complaint: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      diagnose: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      therapy: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      cost: {
        type: Sequelize.DECIMAL,
        allowNull: true,
      },
      full_name: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      phone_number: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      complaint: {
        type: Sequelize.STRING,
        allowNull: true,
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
