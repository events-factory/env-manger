const express = require('express');
const transactionController = require('../controllers/transactionController');
const { authenticateToken } = require('../middlewares/auth.middleware');

const router = express.Router();

router.get('/', authenticateToken, transactionController.getTransactions);

module.exports = router;
