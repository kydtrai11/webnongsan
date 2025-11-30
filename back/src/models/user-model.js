'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class user extends Model {
    static associate(models) {
      user.hasMany(models.Order, { foreignKey: 'userId' });
    }
  }
  user.init({
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.STRING,
      defaultValue: 'customer',
    },
    resetToken: {
      type: DataTypes.STRING,
    },
    resetTokenExpiration: {
      type: DataTypes.DATE,
    },
    customerName: {
      type: DataTypes.STRING,
      allowNull: false, // Bắt buộc nếu cần
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: false, // Bắt buộc nếu cần
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false, // Bắt buộc nếu cần
    },
  }, {
    sequelize,
    modelName: 'user',
  });
  return user;
};