const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ClientList = sequelize.define('ClientList', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
    field: 'ID',
  },
  settlement_account: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'SETTLEMENT_ACCOUNT',
  },
  customer_name: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'CUSTOMER_NAME',
  },
  currency: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'CURRENCY',
  },
  available_balance: {
    type: DataTypes.DECIMAL(20, 6),
    allowNull: false,
    field: 'AVAILABLE_BALANCE',
  },
  acct_type: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'ACCT_TYPE',
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    field: 'CREATEDAT',
  },
  updatedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    field: 'UPDATEDAT',
  },
  gl: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'GL',
  },
}, {
  tableName: 'SETTLEMENT_ACCT',
  timestamps: false, // Disable timestamps
  schema: process.env.SCHEMA,
});

module.exports = ClientList;
