// transactionList.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const TransactionList = sequelize.define('TransactionList', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  settlement_account: {
    type: DataTypes.STRING,
    allowNull: false
  },
  account_owner: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  national_id: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  from_entity: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  account_number: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  transaction_id: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  motif: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  amount_paid: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  processing_date: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  transaction_status: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'PAYMENT_STATUS',
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  updatedAt: {
    type: DataTypes.DATE,
    allowNull: false,
  }
}, {
  tableName: 'TransactionLists',
  schema: process.env.SCHEMA
});

module.exports = TransactionList;
