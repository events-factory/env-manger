const xml2js = require('xml2js');
const { Builder } = xml2js;

const clientService = require('../services/clientService');
const logger = require('../utils/logger');

function getClients(req, res) {
  clientService.getClients()
    .then((clients) => {
      res.send(clients);
    })
    .catch((err) => {
      console.error('Unable to fetch clients:', err);
      res.send('Unable to fetch clients.');
    });
}

function validateAccount(req, res) {
  const { settlement_account } = req.body;
  const userId = req.user.id;
  const userName = req.user.username;
  const { respond_with } = req.body;

  clientService.validateAccount(settlement_account, userId)
    .then((client) => {
      if (client) {
        logger.info(`${userName} Action: Account ${settlement_account} is valid.`);
        if (respond_with === 'json') {
          res.status(200).send({
            status: 'success',
            message: 'Account is valid.',
            data: {
              names: client.customer_name,
              remaining_balance: client.available_balance,
              currency: client.currency,
              settlement_account: client.settlement_account,
              credit_account: client.createdAccounts.map(({ Account_number, Account_name, Account_type }) => ({
                "creditor_account_name": Account_name,
                "creditor_account_number": Account_number,
                Account_type,
              })),
            },
          });
        } else if ( respond_with === 'xml') {
          const filteredData = {
            names: client.customer_name,
            remaining_balance: client.available_balance,
            currency: client.currency,
            settlement_account: client.settlement_account,
            credit_account: client.createdAccounts.map(({ Account_number, Account_name, Account_type }) => ({
              "creditor_account_name": Account_name,
              "creditor_account_number": Account_number,
              Account_type,
            })),
          };

          const xmlResponse = new Builder().buildObject({
            root: {
              status: 'success',
              message: 'Account is valid.',
              data: filteredData,
            },
          });

          res.set('Content-Type', 'application/xml');
          res.status(200).send(xmlResponse);

        }
      } else {
        logger.error(`${userName} Action: Account ${settlement_account} is invalid.`);
        if (respond_with === 'json') {
          res.status(404).send({ status: 'error', message: 'Account is invalid.' });
        } else if (respond_with === 'xml') {
          const xmlResponse = new Builder().buildObject({
            root: {
              status: 'error',
              message: 'Account is invalid.',
            },
          });
        
          res.set('Content-Type', 'application/xml');
          res.status(404).send(xmlResponse);
        }
      }
    })
    .catch((err) => {
      logger.error(`${userName} Action: Error while fetching client: ${err}`);
      console.error('Error while fetching client:', err);
      if (respond_with === 'json') {
        res.status(500).send({ status: 'error', message: 'Unable to validate account.' });
      }else if (respond_with === 'xml') {
        const xmlResponse = new Builder().buildObject({
          root: {
            status: 'error',
            message: 'Unable to validate account.',
          },
        });
      
        res.set('Content-Type', 'application/xml');
        res.status(500).send(xmlResponse);
      }
    });
}

module.exports = {
  getClients,
  validateAccount
};
