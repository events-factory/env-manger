const bcrypt = require('bcrypt');
const User = require('../models/user');
const CreditAccount = require('../models/creditAccount');
const logger = require('../utils/logger');

const saltRounds = 10;

async function createUser(username, password, account_role, user_company, credit_accounts) {
  try {
    const existingUser = await User.findOne({ where: { username } });
    if (existingUser) {
      logger.error(`Username ${username} already exists.`);
      return {
        error: 'Username already exists. Please choose a different username.',
      };
    }

    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const user = await User.create({ username, password: hashedPassword, account_role, user_company });
    const createdAccounts = await createBulkCreditAccounts(credit_accounts, user.id);
    user.dataValues.credit_accounts = createdAccounts;
    logger.info(`User ${username} created successfully.`);
    return user;
  } catch (error) {
    console.error('Error while creating user:', error);
    throw error;
  }
}



async function createBulkCreditAccounts(creditAccounts, userId) {
  try {
    const createdAccounts = [];

    for (const account of creditAccounts) {
      const { Account_number, Account_name, Account_type } = account;
      const createdAccount = await CreditAccount.create({ Account_number, Account_name, User_id: userId, Account_type });
      createdAccounts.push(createdAccount);
      logger.info(`Credit account ${Account_number} created successfully.`);
    }
    logger.info('Credit accounts created successfully.');
    logger.info(`Credit accounts count: ${createdAccounts.length}`);
    return createdAccounts;
  } catch (error) {
    logger.error('Error while creating credit accounts:', error);
    console.error('Error while creating credit accounts:', error);
    throw error;
  }
}

module.exports = {
  createUser
};
