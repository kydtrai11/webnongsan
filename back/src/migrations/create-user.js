'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('user', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      email: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false,
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      role: {
        type: Sequelize.STRING,
        defaultValue: 'customer',
      },
      resetToken: {
        type: Sequelize.STRING,
      },
      resetTokenExpiration: {
        type: Sequelize.DATE,
      },
      customerName: {
        type: Sequelize.STRING,
        allowNull: false, // Bắt buộc nếu cần
      },
      phone: {
        type: Sequelize.STRING,
        allowNull: false, // Bắt buộc nếu cần
      },
      address: {
        type: Sequelize.STRING,
        allowNull: false, // Bắt buộc nếu cần
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
    await queryInterface.dropTable('user');
  }
};