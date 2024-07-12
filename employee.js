const { DataTypes } = require('sequelize');
const sequelize = require('./db');   
const Employee = sequelize.define('Employee', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  firstName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  lastName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  active: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
     defaultValue: true,
  },
});

module.exports = Employee;
