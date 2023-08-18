// creditAccount.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const CreditAccount = sequelize.define('CreditAccount', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  Account_number: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  Account_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  User_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  Account_type: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  updatedAt: {
    type: DataTypes.DATE,
    allowNull: false,
  },
}, {
  tableName: 'CREDIT_ACCOUNT',
  schema: process.env.SCHEMA,
});

module.exports = CreditAccount;
