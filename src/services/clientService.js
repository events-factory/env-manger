const e = require('express');
const ClientList = require('../models/clientList');
const CreditAccount = require('../models/creditAccount');

const logger = require('../utils/logger');

function getClients() {
  return new Promise((resolve, reject) => {
    ClientList.findAll()
      .then((clients) => {
        logger.info('Clients fetched successfully.');
        logger.info(`clents count: ${clients.length}`);
        resolve(clients);
      })
      .catch((err) => {
        console.error('Unable to fetch clients:', err);
        logger.error('Unable to fetch clients:', err);
        reject('Unable to fetch clients.');
      });
  });
}

function validateAccount(settlement_account, userId) {
  return new Promise((resolve, reject) => {
    ClientList.findOne({ where: { settlement_account } })
      .then(async (client) => {
        if (client) {
          try {
            const createdAccounts = await CreditAccount.findAll({ where: { Account_type: client.acct_type, User_id: userId } });
            client.createdAccounts = createdAccounts;
            resolve(client);
          } catch (error) {
            logger.error('Error while fetching created accounts:', error);
            console.error('Error while fetching created accounts:', error);
            reject('Unable to fetch created accounts. Please try again later.');
            resolve(error)
          }
        } else {
          resolve(null);
        }
      })
      .catch((err) => {
        logger.error('Error while fetching client:', err);
        console.error('Error while fetching client:', err);
        reject('Unable to fetch client. Please try again later.');
      });
  });
}


module.exports = {
  getClients,
  validateAccount,
};
