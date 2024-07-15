const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('asset1', 'raaj', 'root', {
  host: 'localhost',
  port: 5432,
  dialect: 'postgres',
  logging: console.log
});
 
module.exports = sequelize;
