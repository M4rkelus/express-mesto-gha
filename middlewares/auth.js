const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../errors/UnauthorizedError');

const { NODE_ENV, JWT_SECRET = 'dev-secret' } = process.env;

const auth = (req, _, next) => {
  const token = req.cookies.jwt;
  let payload;

  try {
    payload = jwt.verify(
      token,
      `${NODE_ENV === 'production'
        ? JWT_SECRET
        : 'dev-secret'}`,
    );
  } catch (err) {
    next(new UnauthorizedError('Неверный электронный адрес или пароль'));
  }

  req.user = payload;

  return next();
};

module.exports = auth;
