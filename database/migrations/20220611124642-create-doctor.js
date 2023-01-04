'use strict'
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('doctors', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.BIGINT,
      },
      guid: {
        allowNull: false,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
      },
      code: {
        unique: true,
        type: Sequelize.STRING,
      },
      specialist: {
        type: Sequelize.STRING,
      },
      user_id: {
        allowNull: true,
        type: Sequelize.BIGINT,
        references: {
          model: 'users',
          key: 'id',
        },
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
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('doctors')
  },
}
