const moviesRouter = require('express').Router();
// импрот контроллеров
const {
  getMovies,
  postMovie,
  deleteMovie,
} = require('../controllers/moviesContoller');
// импорт валидаторов
const {
  postMovieValidator,
  deleteMovieValidator,
} = require('../middlewares/validator');

moviesRouter.get('/', getMovies);
moviesRouter.post('/', postMovieValidator, postMovie);
moviesRouter.delete('/:movieId', deleteMovieValidator, deleteMovie);
// экпорт роутера
module.exports = moviesRouter;
