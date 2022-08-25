const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/user');
const BadRequestError = require('../errors/BadRequestError');
const NotFoundError = require('../errors/NotFoundError');
const ConflictError = require('../errors/ConflictError');

const { NODE_ENV, JWT_SECRET = 'dev-secret' } = process.env;

const getUsers = (_, res, next) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch(next);
};

const getUserById = (req, res, next) => {
  const { userId } = req.params;

  User.findById(userId)
    .orFail(() => {
      throw new NotFoundError(`Пользователь c id: ${userId} не найден`);
    })
    .then((user) => {
      res.send({
        _id: user.id,
        name: user.name,
        about: user.about,
        avatar: user.avatar,
      });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Передан некорректный id пользователя'));
      } else if (err.name === 'NotFoundError') {
        next(new NotFoundError(`Пользователь c id: ${userId} не найден`));
      } else {
        next(err);
      }
    });
};

const getCurrentUser = (req, res, next) => {
  const { _id } = req.user;

  User.findById(_id)
    .orFail(() => {
      throw new NotFoundError(`Пользователь c id: ${_id} не найден`);
    })
    .then((user) => {
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Передан некорректный id пользователя'));
      } else if (err.name === 'NotFoundError') {
        next(new NotFoundError(`Пользователь c id: ${_id} не найден`));
      } else {
        next(err);
      }
    });
};

const createUser = (req, res, next) => {
  const {
    name,
    about,
    avatar,
    email,
    password,
  } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name,
      about,
      avatar,
      email,
      password: hash,
    }))
    .then((user) => {
      res.status(201).send({
        message: `Пользователь ${user.name} успешно создан!`,
        data: {
          name: user.name,
          about: user.about,
          avatar: user.avatar,
          email: user.email,
        },
      });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError(
          'Переданы некорректные данные в методы создания пользователя',
        ));
      } else if (err.code === 11000) {
        next(new ConflictError(
          'Пользователь с таким электронным адресом уже существует',
        ));
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
      throw new NotFoundError(`пользователь c id: ${req.user._id} не найден`);
    })
    .then((user) => {
      res.send({ name: user.name, about: user.about });
    })
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        next(new BadRequestError(
          'Переданы некорректные данные в методы обновления профиля',
        ));
      } else if (err.name === 'NotFoundError') {
        next(new NotFoundError(`Пользователь c id: ${req.user._id} не найден`));
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
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        next(new BadRequestError(
          'Переданы некорректные данные в методы обновления аватара пользователя',
        ));
      } else if (err.name === 'NotFoundError') {
        next(new NotFoundError(`Пользователь c id: ${req.user._id} не найден`));
      } else {
        next(err);
      }
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
        { expiresIn: '7d' },
      );
      res
        .cookie('jwt', token, {
          maxAge: (7 * 24 * 60 * 60),
          httpOnly: true,
          sameSite: true,
        })
        .send({ message: 'Вы успешно авторизовались!' })
        .end();
    })
    .catch(next);
};

module.exports = {
  getUsers,
  getUserById,
  getCurrentUser,
  createUser,
  updProfile,
  updAvatar,
  login,
};
