const express = require('express');
const transactionController = require('../controllers/transactionController');
const { authenticateToken } = require('../middlewares/auth.middleware');
const { requestConverter } = require('../middlewares/requestConverter.middleware');
const { validateTransaction } = require('../middlewares/transaction.middleware');

const router = express.Router();

router.post('/',requestConverter, validateTransaction, authenticateToken, transactionController.createTransaction);
router.post('/payment',requestConverter, validateTransaction, authenticateToken, transactionController.createTransaction);

router.post('/callback', requestConverter, authenticateToken, transactionController.callbackTransaction);
router.post('/callback/debitcompleted', requestConverter, authenticateToken, transactionController.callbackTransaction);

module.exports = router;
