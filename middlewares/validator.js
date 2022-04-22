const { Joi } = require('celebrate');

module.exports.signinSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});
