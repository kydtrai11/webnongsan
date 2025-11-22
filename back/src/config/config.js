require('dotenv').config();
module.exports = {
  // "development": {
  //   "username": process.env.DB_USERNAME,
  //   "password": process.env.DB_PASSWORD,
  //   "database": process.env.DB_DATABASE_NAME,
  //   "host": process.env.DB_HOST,
  //   "port": process.env.DB_PORT,
  //   "dialect": "mysql",
  //   "timezone": "+07:00",
  //   "logging": false,
  //   "query": {
  //     "raw": true
  //   },
  //   "define": {
  //     "freezeTableName": true
  //   }
  // },
  "development": {
    "username": "root",
    "password": null,
    "database": "nongsan",
    "host": "127.0.0.1",
    "dialect": "mysql",
    "timezone": "+07:00",
    "logging": false,
    "query": {
      "raw": true
    },
    "define": {
      "freezeTableName": true
    }
  },
  "test": {
    "username": "root",
    "password": null,
    "database": "crawdata",
    "host": "127.0.0.1",
    "dialect": "mysql",
    "timezone": "+07:00",
    "query": {
      "raw": true
    },
    "define": {
      "freezeTableName": true
    }
  },
  "production": {
    "username": process.env.DB_USERNAME,
    "password": process.env.DB_PASSWORD,
    "database": process.env.DB_DATABASE_NAME,
    "host": process.env.DB_HOST,
    "port": process.env.DB_PORT,
    "dialect": process.env.DB_DIALECT,
    "timezone": "+07:00",
    "query": {
      "raw": true
    },
    "define": {
      "freezeTableName": true
    }
  }
}