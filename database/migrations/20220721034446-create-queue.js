'use strict'
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('queues', {
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
      book_order_id: {
        allowNull: true,
        type: Sequelize.BIGINT,
        references: {
          model: 'book_orders',
          key: 'id',
        },
      },
      state_id: {
        type: Sequelize.BIGINT,
        references: {
          model: 'states',
          key: 'id',
        },
      },
      is_skipped: {
        type: Sequelize.BOOLEAN,
        default: false,
      },
      order_weight: {
        type: Sequelize.DECIMAL,
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
    await queryInterface.dropTable('queues')
  },
}
