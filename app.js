const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const { PORT = 3000 } = process.env;
const app = express();
const auth = (req, _, next) => {
  req.user = {
    _id: '62ef8ed46585f062d9cef432',
  };

  next();
};

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useUnifiedTopology: true,
});

app.use(auth); // Temporary Authorization

app.use('/users', require('./routes/users'));
app.use('/cards', require('./routes/cards'));

app.use((_, res) => {
  res.status(404).send({ message: 'Указан неправильный путь' });
});

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Server started on port ${PORT}`);
});
