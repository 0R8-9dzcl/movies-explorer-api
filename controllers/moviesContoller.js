const Movie = require('../models/movie'); // импорт схемы
// импорт ошибок
const BadReqError = require('../errors/BadReqError');
const ForbiddenError = require('../errors/ForbiddenError');
const NotFoundError = require('../errors/NotFoundError');
const errMess = require('../utils/errMess');

module.exports.getMovies = (req, res, next) => {
  Movie.find({})
    .then((movie) => res.status(200).send({ data: movie }))
    .catch(next);
};

module.exports.postMovie = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    movieId,
    nameRU,
    nameEN,
  } = req.body;
  const owner = req.user._id;
  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    movieId,
    nameRU,
    nameEN,
    owner,
  })
    .then((movie) => res.status(201).send({ data: movie }))
  // данные не записались, вернём ошибку
    .catch((err) => {
      if (err.name === 'ValidationError') next(new BadReqError(errMess.badReq.createMovie));
      next(err);
    });
};

module.exports.deleteMovie = (req, res, next) => {
  Movie.findById(req.params.movieId)
    .then((movie) => {
      if (!movie) throw new NotFoundError(errMess.notFound.movieById);
      if (movie.owner.toString() !== req.user._id.toString()) {
        throw new ForbiddenError(errMess.forbid.notOwn);
      }
      return movie.remove()
        .then(() => res.status(200).send({ message: 'Фильм успешно удален.' }));
    })
    .catch((err) => {
      if (err.name === 'CastError') next(new BadReqError(errMess.badReq.movieDelete));
      next(err);
    });
};
