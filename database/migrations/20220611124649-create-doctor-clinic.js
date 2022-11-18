'use strict'
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('doctor_clinics', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.BIGINT,
      },
      clinic_id: {
        type: Sequelize.BIGINT,
        references: {
          model: 'clinics',
          key: 'id',
        },
      },
      doctor_id: {
        type: Sequelize.BIGINT,
        references: {
          model: 'doctors',
          key: 'id',
        },
      },
      // 1 (senin), 2 (selasa), 3 (rabu), 4 (kamis), 5 (jumat), 6 (sabtu), 7 (minggu), 8 (hari libur nasional).
      // [
      //   {
      //     day: {1},
      //     open: {'08:00'},
      //     close: {'11:00'},
      //   },
      // ]
      schedules: {
        type: Sequelize.ARRAY(Sequelize.JSONB),
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
    await queryInterface.dropTable('doctor_clinics')
  },
}
