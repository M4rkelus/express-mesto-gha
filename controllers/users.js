const User = require('../models/user');
const ApplicationError = require('../errors/ApplicationError');
const BadRequestError = require('../errors/BadRequestError');
const NotFoundError = require('../errors/NotFoundError');

const getUsers = (_, res, next) => {
  User.find({})
    .then((users) => res.status(200).send(users))
    .catch((err) => {
      if (err.name === 'InternalServerError') {
        next(new ApplicationError());
      } else {
        next(err);
      }
    });
};

const getUserById = (req, res, next) => {
  const { userId } = req.params;

  User.findById(userId)
    .orFail(() => {
      throw new NotFoundError(`Пользователь с id: ${userId} не найден`);
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
        next(
          new BadRequestError({
            message: `Передан некорректный id пользователя ${err.message}`,
          }),
        );
      } else if (err.name === 'InternalServerError') {
        next(new ApplicationError());
      } else {
        next(err);
      }
    });
};

const createUser = (req, res, next) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => {
      res.status(201).send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(
          new BadRequestError(
            `Переданы некорректные данные в методы создания пользователя ${err.message}`,
          ),
        );
      } else if (err.name === 'InternalServerError') {
        next(new ApplicationError());
      } else {
        next(err);
      }
    });
};

const updProfile = (req, res, next) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    { new: true, runValidators: true },
  )
    .orFail(() => {
      throw new NotFoundError(`Пользователь с id: ${req.user._id} не найден`);
    })
    .then((user) => {
      res.status(201).send({ name: user.name, about: user.about });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(
          new BadRequestError(
            `Переданы некорректные данные в методы обновления профиля ${err.message}`,
          ),
        );
      } else if (err.name === 'InternalServerError') {
        next(new ApplicationError());
      } else {
        next(err);
      }
    });
};

const updAvatar = (req, res, next) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true })
    .orFail(() => {
      throw new NotFoundError(`Пользователь с id: ${req.user._id} не найден`);
    })
    .then((user) => {
      res.status(201).send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(
          new BadRequestError({
            message: `Переданы некорректные данные в методы обновления аватара пользователя ${err.message}`,
          }),
        );
      } else if (err.name === 'InternalServerError') {
        next(new ApplicationError());
      } else {
        next(err);
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
