'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    static associate(models) {
      // npx sequelize-cli db:migrate
      // Associations như trước
      // Product.belongsTo(models.Category);
      // Product.hasMany(models.Lot);
      // Product.hasOne(models.Nutrition);
      // Product.hasMany(models.Taste);
      // Product.belongsTo(models.Season);
      // Product.belongsToMany(models.Promotion, { through: 'ProductPromotions' });
      // Product.hasMany(models.CartItem);
      // Product.hasMany(models.OrderItem);
      Product.belongsTo(models.Category, {
        foreignKey: 'categoryId',
      });
    }
  }
  Product.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT
    },
    basePrice: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    discountPrice: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    sold: {
      type: DataTypes.INTEGER
    },
    imageUrl: {
      type: DataTypes.STRING
    },
    imageUrls: {
      type: DataTypes.STRING
    },
    isSeasonal: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    categoryId: {
      type: DataTypes.INTEGER
    }
  }, {
    sequelize,
    modelName: 'Product',
  });
  return Product;
};