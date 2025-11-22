const { Sequelize } = require('sequelize');
require('dotenv').config();


const sequelize = new Sequelize('nongsan', 'root', null, {
  host: 'localhost',
  dialect: 'mysql',
  logging: false,
  query: {
    "raw": true
  },
  timezone: "+07:00"
});

// const sequelize = new Sequelize(
//   process.env.DB_DATABASE_NAME,
//   process.env.DB_USERNAME,
//   process.env.DB_PASSWORD,
//   {
//     host: process.env.DB_HOST,
//     port: process.env.DB_PORT,
//     dialect: "mysql",
//     logging: false,
//     query: {
//       "raw": true
//     },
//     timezone: "+07:00"
//   });

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('Connection database success!.');
  } catch (error) {
    console.error('connect db fail:', error);
  } finally {
    console.log('close Connection!!.');
    await sequelize.close(); // Đóng kết nối
  }
}
module.exports = connectDB