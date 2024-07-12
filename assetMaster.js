// assetMaster.js
const { DataTypes } = require('sequelize');
const sequelize = require('./db');
const AssetCategoryMaster = require('./assetCategoryMaster');  

const AssetMaster = sequelize.define('AssetMaster', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  assetName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  assetCategoryType: {
    type: DataTypes.STRING,
    allowNull: false
  },
  make: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  model: {
    type: DataTypes.STRING,
    allowNull: true,
    unique: true
  },
  uom: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  stockQty: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  value: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  date: {
    type: DataTypes.DATE,
    allowNull: true,
  },
});

AssetMaster.belongsTo(AssetCategoryMaster, {
  foreignKey: 'assetCategoryId',
  targetKey: 'id',
  as: 'category'
});

module.exports = AssetMaster;
