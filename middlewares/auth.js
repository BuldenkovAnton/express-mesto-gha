const jwt = require('jsonwebtoken');
require('dotenv').config();
const { UnauthorizedError } = require('../errors/Unauthorized');

module.exports = (req, res, next) => {
  const { jwtToken } = req.cookies;

  if (!jwtToken) {
    return next(new UnauthorizedError('Необходима авторизация'));
  }

  let payload;

  try {
    payload = jwt.verify(jwtToken, process.env.JWT_SECRET);
  } catch (err) {
    return next(new UnauthorizedError('Необходима авторизация'));
  }

  req.user = payload;
  return next();
};
