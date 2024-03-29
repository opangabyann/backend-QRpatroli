'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('titikPatrolis', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      nama: {
        type: Sequelize.STRING
      },
      foto: {
        type: Sequelize.STRING
      },
      thumbnail_id: {
        type: Sequelize.STRING
      },
      latitude: {
        type: Sequelize.STRING
      },
      longitude: {
        type: Sequelize.STRING
      },
      deskripsi: {
        type: Sequelize.STRING
      },
      createdBy:{
        type: Sequelize.INTEGER,
        allowNull: false,
        onDelete :  'CASCADE',
        onUpdate : 'CASCADE',
        references : {
          model : "users",
          key : "id",
          as : "createdBy"
        }
      },
      updatedBy:{
        type: Sequelize.INTEGER,
        allowNull: false,
        onDelete :  'CASCADE',
        onUpdate : 'CASCADE',
        references : {
          model : "users",
          key : "id",
          as : "updatedBy"
        }
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
    await queryInterface.dropTable('titikPatrolis');
  }
};