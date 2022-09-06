const usersRouter = require('express').Router();
// импрот контроллеров
const {
  getUser,
  patchUser,
} = require('../controllers/usersContoller');
// импорт валидаторов
const { patchUserValidator } = require('../validator/validator');

usersRouter.get('/users/me', getUser);
usersRouter.patch('/users/me', patchUserValidator, patchUser);
// экпорт роутера
module.exports = usersRouter;
