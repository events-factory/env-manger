const express = require('express');
const userController = require('../controllers/userController');
const { authenticateToken } = require('../middlewares/auth.middleware');

const router = express.Router();

router.post('/', authenticateToken, userController.createUser);

module.exports = router;
