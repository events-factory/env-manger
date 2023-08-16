const jwt = require('jsonwebtoken');
module.exports = (req, res, next) => {
  const token = req.headers.Authorization || req.headers.authorization;

  if (!token) {
    return res.status(401).json({
      message: 'Authentication token not provided.',
    });
  }

  try {
    const decodedToken = jwt.verify(token, process.env.SECRET_KEY);
    req.user = decodedToken.user;
    req.token = token;
    next();
  } catch (error) {
    return res.status(401).json({
      message: 'Invalid authentication token.',
      token: token,
    });
  }
};
