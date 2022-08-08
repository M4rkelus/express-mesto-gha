// Временная авторизация
const auth = (req, _, next) => {
  req.user = {
    _id: '62ef8ed46585f062d9cef432',
  };

  next();
};

module.exports = auth;
