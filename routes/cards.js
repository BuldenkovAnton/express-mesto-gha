const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { isUrlMethod } = require('../custom_rules/isUrlMethod');

const {
  getCards,
  createCard,
  deleteCardById,
  addCardLike,
  removeCardLike,
} = require('../controllers/cardController');

router.get('/', getCards);

router.post('/', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().custom(isUrlMethod, 'url not valid'),
  }),
}), createCard);

router.delete('/:cardId', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().length(24).hex().required(),
  }),
}), deleteCardById);

router.put('/:cardId/likes', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().length(24).hex().required(),
  }),
}), addCardLike);

router.delete('/:cardId/likes', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().length(24).hex().required(),
  }),
}), removeCardLike);

module.exports = router;
