const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../errors/UnauthorizedError');

const extractBearerToken = (header) => header.replace('Bearer ', '');

const auth = (req, _, next) => {
  const { authorization } = req.headers;

  if (!authorization || authorization.startsWith('Bearer ')) {
    throw new UnauthorizedError('Неверный электронный адрес или пароль');
  }

  const token = extractBearerToken(authorization);
  let payload;

  try {
    payload = jwt.verify(token, 'super-strong-secret');
  } catch (err) {
    throw new UnauthorizedError('Неверный электронный адрес или пароль');
  }

  req.user = payload;

  return next();
};

module.exports = auth;
