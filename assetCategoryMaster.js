const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const AssetCategoryMaster = sequelize.define('AssetCategoryMaster', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  categoryName: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
}, {
  indexes: [
    {
      unique: true,
      fields: ['categoryName']
    }
  ]
});

module.exports = AssetCategoryMaster;
