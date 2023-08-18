const transactionService = require('../services/transactionService');

function validateTransaction (req, res, next) {
  const { transaction_id } = req.body
  if (!transaction_id) {
    return res.status(400).json({
      status: 'error',
      message: 'All fields are required.',
    });
  }else {
    transactionService.getTransactionById(transaction_id)
    .then((transaction) => {
      if (transaction.data) {
        return res.status(400).json({
          status: 'error',
          message: 'Transaction already exists.',
        });
      }else{
        next();
      }
    })
    .catch((err) => {
      console.error('Unable to fetch transaction:', err);
      const response = {
        'message': 'TRANSACTION_NOT_FOUND',
        'data': null,
      }
      resolve(response);
    });
  }
}

module.exports = {
    validateTransaction
}