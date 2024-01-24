'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('logPatrolis', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      idTitikPatroli: {
        type: Sequelize.INTEGER,
        allowNull: false,
        onDelete :  'CASCADE',
        onUpdate : 'CASCADE',
        references : {
          model : "titikPatrolis",
          key : "id",
          as : "idTitikPatroli"
        }
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
      jamPatroli: {
        type: Sequelize.STRING
      },
      tanggalPatroli: {
        type: Sequelize.DATE
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
    await queryInterface.dropTable('logPatrolis');
  }
};