'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class user extends Model {
    static associate(models) {
      // 
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
      type: DataTypes.ENUM('customer', 'supplier', 'admin'),
      defaultValue: 'customer',
    },
    resetToken: {
      type: DataTypes.STRING,
    },
    resetTokenExpiration: {
      type: DataTypes.DATE,
    },
  }, {
    sequelize,
    modelName: 'user',
  });
  return user;
};