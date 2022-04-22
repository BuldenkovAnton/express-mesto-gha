const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { isUrlMethod } = require('../custom_rules/isUrlMethod');

const {
  getUsers,
  getUserById,
  getMyProfile,
  updateUserProfile,
  updateUserAvatar,
} = require('../controllers/userController');

router.get('/', getUsers);
router.get('/me', getMyProfile);

router.get(
  '/:userId',
  celebrate({
    params: Joi.object().keys({
      userId: Joi.string().length(24).hex().required(),
    }),
  }),
  getUserById,
);

router.patch(
  '/me',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().required().min(2).max(30),
      about: Joi.string().required().min(2).max(30),
    }),
  }),
  updateUserProfile,
);

router.patch(
  '/me/avatar',
  celebrate({
    body: Joi.object().keys({
      avatar: Joi.string().required().custom(isUrlMethod, 'url not valid'),
    }),
  }),
  updateUserAvatar,
);

module.exports = router;
