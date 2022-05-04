const express = require('express');
const mongoose = require('mongoose');

const bodyParser = require('body-parser');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');

const { celebrate, errors } = require('celebrate');

const { requestLogger, errorLogger } = require('./middlewares/logger');
const { limiter } = require('./middlewares/limiter');
const { auth } = require('./middlewares/auth');
const { handleError } = require('./middlewares/errors');
const { signinSchema, signupSchema } = require('./middlewares/validator');

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

app.use(requestLogger);
app.post('/signin', celebrate({ body: signinSchema }), login);
app.post('/signup', celebrate({ body: signupSchema }), createUser);
app.get('/signout', auth, logout);

app.use('/users', auth, userRoutes);
app.use('/cards', auth, cardRoutes);
app.use('*', auth, (req, res, next) => next(new NotFoundError('Страница не найдена')));

app.use(errorLogger);
app.use(errors());
app.use(handleError);

app.listen(PORT);
