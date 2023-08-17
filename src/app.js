const express = require('express');
const bodyParser = require('body-parser');
const xmlParser = require('express-xml-bodyparser');
require('dotenv').config();
const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');

const logger = require('./utils/logger');

const db = require('./config/database');
const authRoutes = require('./routes/authRoutes');
const clientRoutes = require('./routes/clientRoutes');
const transactionRoutes = require('./routes/transactionRoutes');
const userRoutes = require('./routes/userRoutes');
const accountsValidate = require('./routes/accountValidate');
const postTransaction = require('./routes/postTransaction');

const app = express();

const options = {
  ca: fs.readFileSync(path.join(__dirname, '../cert/client/mtn', 'm3-external-ca.crt')),
  cert: fs.readFileSync(path.join(__dirname, '../cert/client/mtn', 'brd.crt')),
  key: fs.readFileSync(path.join(__dirname, '../cert', 'domain.key')),
  // passphrase: process.env.SSL_KEY_PHRASE,
};

// Middleware for handling XML and JSON requests
app.use(bodyParser.json());
app.use(xmlParser());

// Routes
app.use('/login', authRoutes);
app.use('/accounts', clientRoutes);

app.use('/accounts-validate', accountsValidate);

app.use('/transaction', postTransaction);

app.use('/transactions', postTransaction);

app.use('/transactions', transactionRoutes);
app.use('/users', userRoutes);


// Default route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the API.' });
});

// Database connection and server setup
const startServer = () => {
  db.authenticate()
    .then(() => {
      console.log('Database connection has been established successfully.');

      const httpServer = http.createServer(app);
      httpServer.listen(process.env.HTTP_PORT, () => {
        console.log(`HTTP server is running on port ${process.env.HTTP_PORT}`);
        logger.info(`HTTP server is running on port ${process.env.HTTP_PORT}`);
      });

      const httpsServer = https.createServer(options, app);
      httpsServer.listen(process.env.HTTPS_PORT, () => {
        console.log(`HTTPS server is running on port ${process.env.HTTPS_PORT}`); 
        logger.info(`HTTPS server is running on port ${process.env.HTTPS_PORT}`); 
      });
    })
    .catch((err) => {
      console.error('Unable to connect to the database:', err);
      logger.error('Unable to connect to the database:', err);
    });
};

startServer();
