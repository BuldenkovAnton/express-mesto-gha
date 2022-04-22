const mongoose = require('mongoose');
const isEmail = require('validator/lib/isEmail');
const bcrypt = require('bcryptjs');

const { isUrl } = require('../middlewares/validator');
const { UnauthorizedError } = require('../errors/Unauthorized');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: 'Жак-Ив Кусто',
  },
  about: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: 'Исследователь',
  },
  avatar: {
    type: String,
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
    validate: {
      validator: (v) => isUrl(v),
      message: (props) => `${props.value} is not a valid url avatar`,
    },
  },
  email: {
    type: String,
    unique: true,
    required: true,
    validate: {
      validator: (v) => isEmail(v),
      message: 'Неправильный формат почты',
    },
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
});

userSchema.statics.findUserByCredentials = async function (email, password) {
  const user = await this.findOne({ email }).select('+password');

  if (!user) {
    throw new UnauthorizedError('Неправильные почта или пароль');
  }

  const matched = await bcrypt.compare(password, user.password);
  if (!matched) {
    throw new UnauthorizedError('Неправильные почта или пароль');
  }

  return user;
};

module.exports = mongoose.model('user', userSchema);
