const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const { NODE_ENV, JWT_SECRET } = process.env;

const { NotFoundError } = require('../errors/NotFound');
const { ConflictError } = require('../errors/Conflict');
const { ValidationError } = require('../errors/ValidationError');

const User = require('../models/user');

module.exports.logout = (req, res) => {
  res.clearCookie('jwtToken').send({ message: 'Выход' });
};

module.exports.login = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const user = await User.findUserByCredentials(email, password);
    const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret', {
      expiresIn: 3600,
    });
    return res
      .cookie('jwtToken', token, { maxAge: 3600000 * 24 * 7, httpOnly: true, sameSite: true })
      .send({ message: 'Пользователь успешно авторизован' });
  } catch (err) {
    return next(err);
  }
};

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch(next);
};

module.exports.getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) throw new NotFoundError('Пользователь не найден');

    return res.send({ data: user });
  } catch (err) {
    return next(err);
  }
};

module.exports.getMyProfile = async (req, res, next) => {
  try {
    const { _id: userId } = req.user;
    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      throw new ValidationError('Переданы некорректные данные пользователя');
    }

    const user = await User.findById(userId);
    if (!user) throw new NotFoundError('Пользователь не найден');

    return res.send({ data: user });
  } catch (err) {
    return next(err);
  }
};

module.exports.createUser = async (req, res, next) => {
  try {
    const hash = await bcrypt.hash(req.body.password, 10);

    const user = await User.create({
      ...req.body,
      password: hash,
    });

    const sendUser = {
      name: user.name,
      about: user.about,
      avatar: user.avatar,
      email: user.email,
    };

    return res.send({ data: sendUser });
  } catch (err) {
    if (err.code === 11000) {
      return next(new ConflictError('Пользователь с таким email уже существует'));
    }

    if (err instanceof mongoose.Error.ValidationError) {
      return next(new ValidationError('Переданы некорректные данные при создании пользователя'));
    }

    return next(err);
  }
};

module.exports.updateUserProfile = async (req, res, next) => {
  try {
    const { _id: userId } = req.user;

    const user = await User.findByIdAndUpdate(
      userId,
      {
        ...req.body,
      },
      { runValidators: true, new: true },
    );

    if (!user) throw new NotFoundError('Пользователь не найден');

    return res.send({ data: user });
  } catch (err) {
    if (err instanceof mongoose.Error.ValidationError) {
      return next(new ValidationError('Переданы некорректные данные при обновлении пользователя'));
    }

    return next(err);
  }
};

module.exports.updateUserAvatar = async (req, res, next) => {
  try {
    const { _id: userId } = req.user;

    const user = await User.findByIdAndUpdate(
      userId,
      { ...req.body },
      { runValidators: true, new: true },
    );

    if (!user) throw new NotFoundError('Пользователь не найден');

    return res.send({ data: user });
  } catch (err) {
    if (err instanceof mongoose.Error.ValidationError) {
      return next(new ValidationError('Переданы некорректные данные при обновлении пользователя'));
    }

    return next(err);
  }
};
