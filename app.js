const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const { errors } = require('celebrate');

const routes = require('./routes');
const error = require('./middlewares/error');

const { PORT = 3000 } = process.env;
const app = express();

app.use(helmet());
app.use(cookieParser());
app.use(express.json());

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useUnifiedTopology: true,
});

app.use(routes); // all routes logic
app.use(errors());
app.use(error); // centralized error handler

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Server started on port ${PORT}`);
});
