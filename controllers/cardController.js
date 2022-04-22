const mongoose = require('mongoose');
const { ForbiddenError } = require('../errors/Forbidden');
const { NotFoundError } = require('../errors/NotFound');
const { ValidationError } = require('../errors/ValidationError');

const Card = require('../models/card');

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .populate('owner')
    .populate('likes')
    .then((cards) => res.send({ data: cards }))
    .catch(next);
};

module.exports.createCard = async (req, res, next) => {
  try {
    const { _id: ownerId } = req.user;
    const card = await Card.create({ ...req.body, owner: ownerId });
    await card.populate('owner');

    return res.send({ data: card });
  } catch (err) {
    if (err instanceof mongoose.Error.ValidationError) {
      return next(new ValidationError('Переданы некорректные данные при создании карточки'));
    }

    return next(err);
  }
};

module.exports.deleteCardById = async (req, res, next) => {
  try {
    const card = await Card.findById(req.params.cardId);
    if (!card) throw new NotFoundError('Карточка не найден');

    await card.populate('owner', '_id');

    if (card.owner._id.toString() !== req.user._id) {
      throw new ForbiddenError('Вы не можете удалить чужую карточку');
    }

    await Card.findByIdAndDelete(req.params.cardId);

    return res.send({ data: card });
  } catch (err) {
    return next(err);
  }
};

module.exports.addCardLike = async (req, res, next) => {
  try {
    const { _id: userId } = req.user;

    const card = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: userId } },
      { new: true },
    );

    if (!card) throw new NotFoundError('Карточка не найден');

    await card.populate('owner');
    await card.populate('likes');

    return res.send({ data: card });
  } catch (err) {
    if (err instanceof mongoose.Error.ValidationError) {
      return next(new ValidationError('Переданы некорректные данные для добавления лайка'));
    }

    return next(err);
  }
};

module.exports.removeCardLike = async (req, res, next) => {
  try {
    const { _id: userId } = req.user;

    const card = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: userId } },
      { new: true },
    );

    if (!card) throw new NotFoundError('Карточка не найдена');

    await card.populate('owner');
    await card.populate('likes');

    return res.send({ data: card });
  } catch (err) {
    if (err instanceof mongoose.Error.ValidationError) {
      return next(new ValidationError('Переданы некорректные данные для удаления лайка'));
    }

    return next(err);
  }
};
