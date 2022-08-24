const { celebrate, Joi } = require('celebrate');

// eslint-disable-next-line
const urlCheckPattern = /(?:(?:https?|ftp|file):\/\/|www\.|ftp\.)(?:\([-A-Z0-9+&@#\/%=~_|$?!:,.]*\)|[-A-Z0-9+&@#\/%=~_|$?!:,.])*(?:\([-A-Z0-9+&@#\/%=~_|$?!:,.]*\)|[A-Z0-9+&@#\/%=~_|$])/igm;

const authValidate = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
});

const registerValidate = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().pattern(urlCheckPattern),
    email: Joi.string().required().email(),
    password: Joi.string().required(),

  }),
});

const userValidate = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30),
  }),
});

const userIdValidate = celebrate({
  params: {
    userId: Joi.string().hex().length(24),
  },
});

const avatarValidate = celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().pattern(urlCheckPattern),
  }),
});

const cardValidate = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().pattern(urlCheckPattern),
  }),
});

const cardIdValidate = celebrate({
  params: {
    userId: Joi.string().hex().length(24),
  },
});

module.exports = {
  authValidate,
  registerValidate,
  userValidate,
  userIdValidate,
  avatarValidate,
  cardValidate,
  cardIdValidate,
};
