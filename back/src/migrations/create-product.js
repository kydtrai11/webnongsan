'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Product', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      description: {
        type: Sequelize.TEXT,
      },
      basePrice: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },
      discountPrice: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },
      sold: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      imageUrl: {
        type: Sequelize.STRING,
      },
      tags: {
        type: Sequelize.STRING, // Sửa từ ARRAY thành JSON
        // defaultValue: [],
      },
      isSeasonal: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      categoryId: {
        type: Sequelize.INTEGER,
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
    await queryInterface.dropTable('Product');
  }
};