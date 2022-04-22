const router = require('express').Router();
const { celebrate } = require('celebrate');

const {
  createCardSchema,
  deleteCardSchema,
  addCardLikeSchema,
  deleteCardLikeSchema,
} = require('../middlewares/validator');

const {
  getCards,
  createCard,
  deleteCardById,
  addCardLike,
  removeCardLike,
} = require('../controllers/cardController');

router.get('/', getCards);
router.post('/', celebrate({ body: createCardSchema }), createCard);
router.delete('/:cardId', celebrate({ params: deleteCardSchema }), deleteCardById);
router.put('/:cardId/likes', celebrate({ params: addCardLikeSchema }), addCardLike);
router.delete('/:cardId/likes', celebrate({ params: deleteCardLikeSchema }), removeCardLike);

module.exports = router;
