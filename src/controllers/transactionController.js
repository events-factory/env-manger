const xml2js = require('xml2js');
const { Builder } = xml2js;

const transactionService = require('../services/transactionService');
const logger = require('../utils/logger');

function createTransaction(req, res) {
  const { respond_with } = req.body;
  const userName = req.user.username;
  const {
    settlement_account,
    account_owner_name,
    national_id,
    creditor_account_name,
    creditor_account_number,
    transaction_id,
    motif,
    amount,
    transaction_status,
    date_posted,
  } = req.body;

  if (
    !settlement_account ||
    !account_owner_name ||
    !national_id ||
    !creditor_account_name ||
    !creditor_account_number ||
    !transaction_id ||
    !motif ||
    !amount ||
    !date_posted
  ) {
    logger.error('${userName} Action: Unable to create transaction. All fields are required.');
    return res.status(400).json({
      status: 'error',
      message: 'All fields are required.',
    });
  }

  transactionService.createTransaction(
    settlement_account,
    req.user.id,
    account_owner_name,
    national_id,
    creditor_account_name,
    creditor_account_number,
    transaction_id,
    motif,
    amount,
    transaction_status || 'COMPLETED',
    new Date(date_posted)
  )
    .then((transaction) => {
      if (transaction.status === 'error') {
        logger.error(`${userName} Action: Unable to create transaction. ${transaction.message}`);
        if (respond_with === 'json') {
          res.status(400).json(transaction);
        }else if (respond_with === 'xml') {
          const xmlResponse = new Builder().buildObject(transaction);
          res.status(400).send(xmlResponse);
        }
      }else{
        logger.info(`${userName} Action: Transaction created successfully.`);
        if (respond_with === 'json') {
          res.status(201).json({
            status: 'success',
            message: 'Transaction created successfully.',
            data: {
              "id": 55,
              "settlement_account": transaction.settlement_account,
              "account_owner": transaction.account_owner,
              "from_entity": transaction.from_entity,
              "account_number": transaction.account_number,
              "transaction_id": transaction.transaction_id,
              "amount_paid": transaction.amount_paid,
              "processing_date": transaction.processing_date,
            }
          });
        }else if (respond_with === 'xml') {
          const xmlResponse = new Builder().buildObject({
            brd: {
              status: 'success',
              message: 'Transaction created successfully.',
              data: {
                dataValues: {
                  "id": 55,
                  "settlement_account": transaction.settlement_account,
                  "account_owner": transaction.account_owner,
                  "from_entity": transaction.from_entity,
                  "account_number": transaction.account_number,
                  "transaction_id": transaction.transaction_id,
                  "amount_paid": transaction.amount_paid,
                },
              }
            },
          });
          res.status(201).send(xmlResponse);
        }
      }
    })
    .catch((error) => {
      logger.error(`${userName} Action: Transaction created successfully.`);
      console.error('Unable to create transaction:', error);
      if (respond_with === 'json') {
        res.status(500).json({
          status: 'error',
          message: 'Unable to create transaction. Please try again later.',
        });
      }else if (respond_with === 'xml') {
        const xmlResponse = new Builder().buildObject({
          root: {
            status: 'error',
            message: 'Unable to create transaction. Please try again later.',
          },
        });
        res.status(500).send(xmlResponse);
      }
    });
}

function getTransactions(req, res) {
  transactionService.getTransactions()
    .then((transactions) => {
      res.send(transactions);
    })
    .catch((err) => {
      console.error('Unable to fetch transactions:', err);
      res.send('Unable to fetch transactions.');
    });
}

function callbackTransaction(req, res) {
  const { transaction_id, transaction_status } = req.body;
  const userName = req.user.username;

  if (!transaction_id || !transaction_status) {
    logger.error(`${userName} Action: Unable to confirm transaction. Transaction ID and status are required.`);
    return res.status(400).json({
      status: 'error',
      message: 'Transaction ID and status are required.',
    });
  } else {
    transactionService.callbackTransaction(transaction_id, transaction_status)
      .then((transaction) => {
        if (transaction.status === 'error') {
          logger.error(`${userName} Action: Unable to confirm transaction. ${transaction.message}`);
          res.status(400).json(transaction);
        }else{
          logger.info(`${userName} Action: Transaction with ID ${transaction_id} is ${transaction_status} successfully.`);
          res.status(200).json({
            status: 'success',
            message: 'Transaction confirmed successfully.',
          });
        }
      })
      .catch((error) => {
        logger.error(`${userName} Action: Unable to confirm transaction. ${error}`);
        console.error('Unable to confirm transaction:', error);
        res.status(500).json({
          status: 'error',
          message: 'Unable to confirm transaction. Please try again later.',
        });
      });
  }
}


module.exports = {
  createTransaction,
  getTransactions,
  callbackTransaction,
};
