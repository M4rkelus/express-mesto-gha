const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const { errors } = require('celebrate');

const auth = require('./middlewares/auth');
const error = require('./middlewares/error');
const { createUser, login } = require('./controllers/users');
const { authValidate, registerValidate } = require('./middlewares/validation');
const NotFoundError = require('./errors/NotFoundError');

const { PORT = 3000 } = process.env;
const app = express();

app.use(cookieParser());
app.use(express.json());

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useUnifiedTopology: true,
});

app.post('/signup', registerValidate, createUser);
app.post('/signin', authValidate, login);

// app.use('/users', require('./routes/users'));
// app.use('/cards', require('./routes/cards'));
app.use('/users', require('./routes/users'));
app.use('/cards', require('./routes/cards'));

app.use(() => {
  throw new NotFoundError('Указан неправильный путь');
});

app.use(auth);
app.use(errors());
app.use(error); // centralized error handler

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Server started on port ${PORT}`);
});
