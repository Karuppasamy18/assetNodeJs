 const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const BranchMaster = sequelize.define('BranchMaster', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  branchName: {
    type: DataTypes.STRING,
    allowNull: false
  }
});

module.exports = BranchMaster;
