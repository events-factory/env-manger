const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const logger = require('../utils/logger');

const saltRounds = 10;
const jwtSecret = process.env.JWT_SECRET;

function login(username, password) {
  return new Promise((resolve, reject) => {
    User.findOne({ where: { username } })
      .then((user) => {
        if (!user) {
          logger.error(`User ${username} not found.`);
          reject({ status: 401, message: 'User not found.' });
        }else{
          bcrypt.compare(password, user.password, (err, result) => {
            if (err) {
              logger.error('Error while comparing password:', err);
              reject(err);
            }
  
            if (!result) {
              reject({ status: 401, message: 'Invalid password.' });
            }
  
            const token = jwt.sign(
              { id: user.id, username: user.username, account_role: user.account_role },
              jwtSecret,
              { expiresIn: '30d' }
            );
            logger.info(`User ${username} logged in.`);
            resolve(token);
          });
        }
      })
      .catch((err) => {
        logger.error('Error while finding user:', err);
        console.error('Error while finding user:', err);
        reject(err);
      });
  });
}

module.exports = {
  login,
};
