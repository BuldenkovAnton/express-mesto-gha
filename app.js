const express = require('express');
const mongoose = require('mongoose');

const bodyParser = require('body-parser');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');

const { celebrate, Joi, errors } = require('celebrate');
const { isUrlMethod } = require('./custom_rules/isUrlMethod');

const { limiter } = require('./middlewares/limiter');
const { auth } = require('./middlewares/auth');
const { handleError } = require('./middlewares/errors');
const { signinSchema } = require('./middlewares/validator');

const userRoutes = require('./routes/users');
const cardRoutes = require('./routes/cards');

const { login, createUser, logout } = require('./controllers/userController');

const { NotFoundError } = require('./errors/NotFound');

mongoose.connect('mongodb://localhost:27017/mestodb');

const app = express();
const { PORT = 3000 } = process.env;

app.use(limiter);
app.use(helmet());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.post('/signin', celebrate({ body: signinSchema }), login);

app.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().custom(isUrlMethod, 'url not valid'),
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
}), createUser);

app.get('/signout', auth, logout);

app.use('/users', auth, userRoutes);
app.use('/cards', auth, cardRoutes);
app.use('*', auth, (req, res, next) => next(new NotFoundError('Страница не найдена')));

app.use(errors());
app.use(handleError);

app.listen(PORT);
