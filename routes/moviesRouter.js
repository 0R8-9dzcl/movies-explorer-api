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
} = require('../validator/movieValidator');

moviesRouter.get('/movies', getMovies);
moviesRouter.post('/movies', postMovieValidator, postMovie);
moviesRouter.delete('/movies/:movieId', deleteMovieValidator, deleteMovie);
// экпорт роутера
module.exports = moviesRouter;
