const express = require('express');
const clientController = require('../controllers/clientController');
const { authenticateToken } = require('../middlewares/auth.middleware');

const router = express.Router();

router.get('/', authenticateToken, clientController.getClients);

module.exports = router;
