const { DataTypes } = require('sequelize');
const sequelize = require('../db'); // Adjust path as per your project structure
const Employee = require('./employee'); // Assuming correct path to Employee model
const AssetMaster = require('./assetMaster'); // Assuming correct path to AssetMaster model

const IssueMaster = sequelize.define('IssueMaster', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  qty: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  reason: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  date: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  type: {
    type: DataTypes.STRING,
    allowNull: true,
  },
});

IssueMaster.belongsTo(Employee, {
  foreignKey: 'empId',
  targetKey: 'id',
  as: 'employee'
});

const IssueItemMaster = sequelize.define('IssueItemMaster', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  qty: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
});

IssueItemMaster.belongsTo(IssueMaster, {
  foreignKey: 'issueId',
  targetKey: 'id',
  allowNull: false,
  as: 'issue'
});

IssueItemMaster.belongsTo(AssetMaster, {
  foreignKey: 'assetId',
  allowNull: false,
  targetKey: 'id',
  as: 'asset'
});

IssueMaster.hasMany(IssueItemMaster, {
  foreignKey: 'issueId',
  targetKey: 'id',
  allowNull: false,
  as: 'items'
});

module.exports = { IssueMaster, IssueItemMaster };
