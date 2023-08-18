const express = require('express');
const clientController = require('../controllers/clientController');
const { authenticateToken } = require('../middlewares/auth.middleware');
const { requestConverter } = require('../middlewares/requestConverter.middleware');

const router = express.Router();

router.post('/',requestConverter ,authenticateToken, clientController.validateAccount);
router.post('/getfinancialresourceinformation',requestConverter ,authenticateToken, clientController.validateAccount);

module.exports = router;
