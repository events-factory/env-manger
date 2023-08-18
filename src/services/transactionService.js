const TransactionList = require('../models/transactionList');
const ClientList = require('../models/clientList');
const logger = require('../utils/logger');

function createTransaction(
  settlement_account,
  userId,
  account_owner_name,
  national_id,
  creditor_account_name,
  creditor_account_number,
  transaction_id,
  motif,
  amount,
  transaction_status,
  processing_date
) {
  return new Promise((resolve, reject) => {
    ClientList.findOne({ where: { settlement_account } })
      .then((client) => {
        if (!client) {
          const errorObj = {
            status: 'error',
            message: 'Settlement account does not exist.',
          };
          resolve(errorObj);
        }

        TransactionList.create({
          settlement_account,
          user_id: userId,
          account_owner: account_owner_name,
          national_id,
          from_entity: creditor_account_name,
          account_number: creditor_account_number,
          transaction_id,
          motif,
          amount_paid: amount,
          transaction_status,
          processing_date,
        })
          .then((transaction) => {
            resolve(transaction);
          })
          .catch((error) => {
            console.error('Unable to create transaction:', error);
            const errorObj = {
              status: 'error',
              message: 'Unable to create transaction. Please try again later.',
            };
            resolve(errorObj);
          });
      })
      .catch((error) => {
        console.error('Error while fetching client:', error);
        const errorObj = {
          status: 'error',
          message: 'Unable to fetch client. Please try again later.',
        };
        resolve(errorObj);
      });
  });
}

function getTransactions() {
  return new Promise((resolve, reject) => {
    TransactionList.findAll()
      .then((transactions) => {
        resolve(transactions);
      })
      .catch((err) => {
        console.error('Unable to fetch transactions:', err);
        reject('Unable to fetch transactions.');
      });
  });
}

function getTransactionById(transactionId) {
  return new Promise((resolve, reject) => {
    TransactionList.findOne({ where: { transaction_id: transactionId } })
      .then((transaction) => {
        logger.info('Transaction retrieved successfully.');
        logger.info(`Transaction: ${transaction}`);
        resolve({
          'message': 'Transaction retrieved successfully.',
          'data': transaction,
        });
      })
      .catch((err) => {
        console.error('Unable to fetch transaction:', err);
        logger.error('Unable to fetch transaction:', err);
        const response = {
          'message': 'Unable to fetch transaction. Please try again later.',
          'data': null,
        }
        resolve(response);
      });
  });
}

function callbackTransaction(transactionId, transactionStatus) {
  return new Promise((resolve, reject) => {
    TransactionList.findOne({ where: { transaction_id: transactionId } })
      .then((transaction) => {
        if (!transaction) {
          logger.error('Transaction does not exist.');
          const response = {
            'message': 'Transaction does not exist.',
            'data': null,
          }
          resolve(response);
        } else {
          transaction.update({
            transaction_status: transactionStatus,
          })
            .then((updatedTransaction) => {
              logger.info(`Transaction with ${transactionId} is ${transactionStatus}.`);
              logger.info(`Transaction: ${updatedTransaction}`);
              const response = {
                'message': `Transaction with ${transactionId} is ${transactionStatus}.`,
              }
              resolve(response);
            })
            .catch((err) => {
              console.error('Unable to confirm transaction:', err);
              logger.error('Unable to confirm transaction:', err);
              const response = {
                'message': 'Unable to confirm transaction. Please try again later.',
                'data': null,
              }
              resolve(response);
            });
        }
      })
      .catch((err) => {
        console.error('Unable to fetch transaction:', err);
        logger.error('Unable to fetch transaction:', err);
        const response = {
          'message': 'Unable to fetch transaction. Please try again later.',
          'data': null,
        }
        resolve(response);
      });
  });
}


module.exports = {
  createTransaction,
  getTransactions,
  getTransactionById,
  callbackTransaction,
};
