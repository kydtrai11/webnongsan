'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Category extends Model {
    static associate(models) {
      // Category - Product (1-N)
      Category.hasMany(models.Product, {
        foreignKey: 'categoryId',
      });
    }
  }
  Category.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT
    }
  }, {
    sequelize,
    modelName: 'Category',
  });
  return Category;
};