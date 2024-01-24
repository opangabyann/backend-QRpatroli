'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('laporans', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      idUser: {
        type: Sequelize.INTEGER,
        allowNull: false,
        onDelete :  'CASCADE',
        onUpdate : 'CASCADE',
        references : {
          model : "users",
          key : "id",
          as : "idUser"
        }
      },
      latitude: {
        type: Sequelize.STRING
      },
      longitude: {
        type: Sequelize.STRING
      },
      judulLaporan: {
        type: Sequelize.STRING
      },
      tanggalLaporan: {
        type: Sequelize.DATE
      },
      jenisLaporan: {
        type: Sequelize.STRING
      },
      gambarLaporan: {
        type: Sequelize.STRING
      },
      thumbnail_id: {
        type: Sequelize.STRING
      },
      deskripsi: {
        type: Sequelize.TEXT
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('laporans');
  }
};