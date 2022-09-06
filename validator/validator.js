const { celebrate, Joi } = require('celebrate');// импорт валидатора
const regExp = require('../utils/regex'); // импорт регулярки

module.exports.postMovieValidator = celebrate({
  body: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.number().required(),
    description: Joi.string().required(),
    image: Joi.string().required().pattern(regExp),
    trailerLink: Joi.string().required().pattern(regExp),
    thumbnail: Joi.string().required().pattern(regExp),
    movieId: Joi.number().required(),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
  }),
});
module.exports.deleteMovieValidator = celebrate({
  params: Joi.object().keys({
    movieId: Joi.string().length(24).hex(),
  }),
});
module.exports.createUserValidator = celebrate({
  body: Joi.object().keys({
    name: Joi.string().default('Александр').min(2).max(30),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
});
module.exports.loginUserValidator = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
});
module.exports.patchUserValidator = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    name: Joi.string().required().min(2).max(30),
  }),
});
