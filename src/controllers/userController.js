const userService = require('../services/userService');

function createUser(req, res) {
  if (req.user.account_role !== 'ADMIN') {
    return res.status(403).send({ status: 'error', message: 'Only admins can create users.' });
  }

  const { username, password, account_role, user_company, credit_accounts } = req.body;

  userService.createUser(username, password, account_role, user_company, credit_accounts)
    .then((user) => {
      if (user.error) {
        return res.status(400).send(user);
      } else {
        res.status(201).send({ status: 'success', message: 'User created successfully.', data: user });
      }
    })
    .catch((error) => {
      console.error('Unable to create user:', error);
      res.status(500).send({ status: 'error', message: 'Unable to create user.' });
    });
}

module.exports = {
  createUser,
};
