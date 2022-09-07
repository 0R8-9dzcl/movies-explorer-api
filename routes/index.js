const router = require('express').Router();
const auth = require('../middlewares/auth');
const usersRouter = require('./usersRouter');
const moviesRouter = require('./moviesRouter');
const { login, createUser, logout } = require('../controllers/usersContoller');
const NotFoundError = require('../errors/NotFoundError');
const errMess = require('../utils/errMess');
// импорт валидаторов
const {
  createUserValidator,
  loginUserValidator,
} = require('../validator/validator');

// роуты неавторизованого пользователя
router.post('/signup', createUserValidator, createUser);
router.post('/signin', loginUserValidator, login);
// Защита авторизацией
router.use(auth);
router.use('/users', usersRouter);
router.use('/movies', moviesRouter);
router.post('/signout', logout);
router.use('*', (req, res, next) => {
  next(new NotFoundError(errMess.notFound.url));
});
module.exports = router;
