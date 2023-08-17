const authService = require('../services/authService');

function login(req, res) {
  const { username, password } = req.body;
  authService.login(username, password)
    .then((result) => {
      console.log('Login successful');
      res.status(200).send({ status: 'success', message: 'Login successful.', data: { token: result } });
    })
    .catch((error) => {
      res.status(error.status).send({ status: 'error', message: error.message });
    });
}


module.exports = {
  login,
};
