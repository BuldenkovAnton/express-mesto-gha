const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const { celebrate, Joi, errors } = require('celebrate');
const helmet = require('helmet');
const { isUrlMethod } = require('./custom_rules/isUrlMethod');
const { limiter } = require('./middlewares/limiter');

const auth = require('./middlewares/auth');

const {
  login,
  createUser,
} = require('./controllers/userController');

const userRoutes = require('./routes/users');
const cardRoutes = require('./routes/cards');

const { NOT_FOUND_ERROR_CODE } = require('./errors/NotFound');

mongoose.connect('mongodb://localhost:27017/mestodb');

const app = express();
const { PORT = 3000 } = process.env;

app.use(limiter);
app.use(helmet());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required().min(6),
  }),
}), login);

app.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().custom(isUrlMethod, 'url not valid'),
    email: Joi.string().email().required(),
    password: Joi.string().required().min(6),
  }),
}), createUser);

app.use('/users', auth, userRoutes);
app.use('/cards', auth, cardRoutes);
app.use('*', (req, res) => res.status(NOT_FOUND_ERROR_CODE).send({ message: 'Страница не найдена' }));

app.use(errors());

app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;
  res
    .status(statusCode)
    .send({ message: message === 500 ? 'Произошла ошибка' : message });

  next();
});

app.listen(PORT);
