const User = require('../models/user');
const NotFoundError = require('../errors/NotFoundError');
const {
  BAD_REQUEST_CODE,
  NOT_FOUND_CODE,
  SERVER_ERROR_CODE,
} = require('../errors/const');

const getUsers = (_, res) => {
  User.find({})
    .then((users) => res.status(200).send(users))
    .catch((err) => {
      res
        .status(SERVER_ERROR_CODE)
        .send({ message: `Ошибка сервера, ${err.message}` });
    });
};

const getUserById = (req, res) => {
  const { userId } = req.params;

  User.findById(userId)
    .orFail(() => {
      throw new NotFoundError(`пользователь c id: ${userId} не найден`);
    })
    .then((user) => {
      res.status(200).send({
        _id: user.id,
        name: user.name,
        about: user.about,
        avatar: user.avatar,
      });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(BAD_REQUEST_CODE).send({
          message: `Передан некорректный id пользователя, ${err.message}`,
        });
      } else if (err.name === 'NotFoundError') {
        res.status(NOT_FOUND_CODE).send({ message: `${err.message}` });
      } else {
        res
          .status(SERVER_ERROR_CODE)
          .send({ message: `Ошибка сервера, ${err.message}` });
      }
    });
};

const createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => {
      res.status(201).send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(BAD_REQUEST_CODE).send({
          message: `Переданы некорректные данные в методы создания пользователя, ${err.message}`,
        });
      } else {
        res
          .status(SERVER_ERROR_CODE)
          .send({ message: `Ошибка сервера, ${err.message}` });
      }
    });
};

const updProfile = (req, res) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    { new: true, runValidators: true },
  )
    .orFail(() => {
      throw new NotFoundError(`пользователь c id: ${req.user._id} не найден`);
    })
    .then((user) => {
      res.status(200).send({ name: user.name, about: user.about });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(BAD_REQUEST_CODE).send({
          message: `Переданы некорректные данные в методы обновления профиля, ${err.message}`,
        });
      } else if (err.name === 'NotFoundError') {
        res.status(NOT_FOUND_CODE).send({ message: `${err.message}` });
      } else {
        res
          .status(SERVER_ERROR_CODE)
          .send({ message: `Ошибка сервера, ${err.message}` });
      }
    });
};

const updAvatar = (req, res) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true })
    .orFail(() => {
      throw new NotFoundError(`Пользователь с id: ${req.user._id} не найден`);
    })
    .then((user) => {
      res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(BAD_REQUEST_CODE).send({
          message: `Переданы некорректные данные в методы обновления аватара пользователя ${err.message}`,
        });
      } else if (err.name === 'NotFoundError') {
        res.status(NOT_FOUND_CODE).send({ message: `${err.message}` });
      } else {
        res
          .status(SERVER_ERROR_CODE)
          .send({ message: `Ошибка сервера, ${err.message}` });
      }
    });
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updProfile,
  updAvatar,
};
