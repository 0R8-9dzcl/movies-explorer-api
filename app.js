const express = require('express');
const mongoose = require('mongoose');
const { errors } = require('celebrate'); // валидатор запросов
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const cors = require('./middlewares/cors'); // импорт CORS
const auth = require('./middlewares/auth');
const usersRouter = require('./routes/usersRouter');
const moviesRouter = require('./routes/moviesRouter');
const { login, createUser, logout } = require('./controllers/usersContoller');
const NotFoundError = require('./errors/NotFoundError');
const { requestLogger, errorLogger } = require('./middlewares/logger'); // импорт логов
// импорт валидаторов
const {
  createUserValidator,
  loginUserValidator,
} = require('./validator/userValidator');

const { PORT = 3500 } = process.env;
// подключение к базе данных
mongoose.connect('mongodb://localhost:27017/bitfilmsdb');

const app = express();
// включаю корс
app.use(cors);
// подключаю парсеры
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(requestLogger); // подключаем логгер запросов
// роуты неавторизованого пользователя
app.post('/signin', loginUserValidator, login);
app.post('/signup', createUserValidator, createUser);
// Защита авторизацией
app.use(auth);
// подключаю роутинг
app.use('/', usersRouter);
app.use('/', moviesRouter);
app.post('/signout', logout);
app.use('*', (req, res, next) => {
  next(new NotFoundError('Запрашиваемый ресурс не найден'));
});
// обработчики ошибок
app.use(errorLogger); // подключаем логгер ошибок
app.use(errors()); // обработчик ошибок celebrate
// Централизованная обработка ошибок
app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;
  res.status(statusCode).send({
    message: statusCode === 500
      ? `На сервере произошла ошибка ${err}`
      : message,
  });
  next();
});

app.listen(PORT, () => {
  // Если всё работает, консоль покажет, какой порт приложение слушает
  console.log(`App listening on port ${PORT}`);
});
