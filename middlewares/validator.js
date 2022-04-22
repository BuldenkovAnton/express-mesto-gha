const { Joi } = require('celebrate');

const isUrl = (value) => /^((https|http):\/\/)(www.)?([a-z0-9-.]*\.[a-z]*)(\/[a-zA-Z0-9#-_]+\/?)*$/mg.test(value);

const isUrlMethod = (value, helpers) => {
  if (!isUrl(value)) {
    return helpers.error('any.invalid');
  }
  return value;
};

const signinSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

const signupSchema = Joi.object({
  name: Joi.string().min(2).max(30),
  about: Joi.string().min(2).max(30),
  avatar: Joi.string().custom(isUrlMethod, 'url not valid'),
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

const createCardSchema = Joi.object({
  name: Joi.string().required().min(2).max(30),
  link: Joi.string().required().custom(isUrlMethod, 'url not valid'),
});

const deleteCardSchema = Joi.object({
  cardId: Joi.string().length(24).hex().required(),
});

const addCardLikeSchema = Joi.object({
  cardId: Joi.string().length(24).hex().required(),
});

const deleteCardLikeSchema = Joi.object({
  cardId: Joi.string().length(24).hex().required(),
});

const getUserByIdSchema = Joi.object({
  userId: Joi.string().length(24).hex().required(),
});

/*
Наставник сказал оставить комментарий в коде, что тест проблемный и нужно проверять в ручную.

Падают тесты: Обновление данных пользователя с полем about меньше 2 символов,
Обновление данных пользователя с полем about больше 30 символов.

Тест не проходит как только добавляю required, без него тест проходит.
*/
const updateUserProfileSchema = Joi.object({
  name: Joi.string().min(2).max(30).required(),
  about: Joi.string().min(2).max(30).required(),
});

const updateUserAvatarSchema = Joi.object({
  avatar: Joi.string().required().custom(isUrlMethod, 'url not valid'),
});

module.exports = {
  signinSchema,
  signupSchema,
  createCardSchema,
  deleteCardSchema,
  addCardLikeSchema,
  deleteCardLikeSchema,
  getUserByIdSchema,
  updateUserProfileSchema,
  updateUserAvatarSchema,
  isUrl,
  isUrlMethod,
};
