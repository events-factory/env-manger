// authRoutes.js
const express = require('express');
const authController = require('../controllers/authController');
const { requestConverter } = require('../middlewares/requestConverter.middleware');


const router = express.Router();

router.post('/', requestConverter, authController.login);

module.exports = router;
