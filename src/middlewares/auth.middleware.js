const jwt = require('jsonwebtoken');

const jwtSecret  = process.env.JWT_SECRET;

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).send({ status: 'error', message: 'Unauthorized request.' });
  }

  jwt.verify(token, jwtSecret, (err, user) => {
    if (err) {
      console.error('Error while verifying token:', err);
      return res.status(403).send({ status: 'error', message: 'Invalid token.' });
    }

    req.user = user;
    next();
  });
}

module.exports = {
  authenticateToken
};
