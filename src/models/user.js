// user.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  account_status: {
    type: DataTypes.ENUM('active', 'inactive'),
    allowNull: false,
    defaultValue: 'active',
  },
  account_role: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  user_company: {
    type: DataTypes.STRING,
    allowNull: true,
  },
}, {
  tableName: 'USERS',
  schema: process.env.SCHEMA,
});

module.exports = User;
