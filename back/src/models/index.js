'use strict';
require('dotenv').config();
const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const process = require('process');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.js')[env];
const db = {};

let sequelize;

// const customizeConfig = {
//   host: process.env.DB_HOST,
//   port: process.env.DB_PORT,
//   dialect: "mysql",
//   logging: false,
//   define: {
//     freezeTableName: true
//   },
//   query: {
//     "raw": true
//   },
//   // timezone: "+07:00"
// }

// sequelize = new Sequelize(
//   process.env.DB_DATABASE_NAME,
//   process.env.DB_USERNAME,
//   process.env.DB_PASSWORD,
//   customizeConfig);

if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

// Import all models from files first
fs
  .readdirSync(__dirname)
  .filter(file => {
    return (
      file.indexOf('.') !== 0 &&
      file !== basename &&
      file.slice(-3) === '.js' &&
      file.indexOf('.test.js') === -1
    );
  })
  .forEach(file => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });

// Manually import additional models if needed (but since they are in the folder, the filter should catch them)
db.User = require('./user-model.js')(sequelize, Sequelize.DataTypes);
db.Product = require('./product-model.js')(sequelize, Sequelize.DataTypes);
db.Category = require('./category-model.js')(sequelize, Sequelize.DataTypes);

// Now run associations after all models are loaded
Object.keys(db).forEach(modelName => {
  if (db[modelName] && db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;