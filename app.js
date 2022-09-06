const express = require('express');
const mongoose = require('mongoose');
const { errors } = require('celebrate'); // валидатор запросов
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const cors = require('cors'); // импорт CORS
const { default: helmet } = require('helmet'); // достаём шлем из чулана
const corsOptions = require('./utils/corsOptions');
const auth = require('./middlewares/auth');
const usersRouter = require('./routes/usersRouter');
const moviesRouter = require('./routes/moviesRouter');
const { login, createUser, logout } = require('./controllers/usersContoller');
const NotFoundError = require('./errors/NotFoundError');
const { requestLogger, errorLogger } = require('./middlewares/logger'); // импорт логов
const centralError = require('./middlewares/centralError'); // централизованный обработчик ошибок
// импорт валидаторов
const {
  createUserValidator,
  loginUserValidator,
} = require('./validator/userValidator');

const { PORT = 3000 } = process.env;
// подключение к базе данных
mongoose.connect('mongodb://localhost:27017/bitfilmsdb');

const app = express();
// включаю корс
app.use(cors(corsOptions));
// Надеваем шлем
app.use(helmet());
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
app.use('/', usersRouter, moviesRouter);
app.post('/signout', logout);
app.use('*', (req, res, next) => {
  next(new NotFoundError('Запрашиваемый ресурс не найден'));
});
// обработчики ошибок
app.use(errorLogger); // подключаем логгер ошибок
app.use(errors()); // обработчик ошибок celebrate
// Централизованная обработка ошибок
app.use(centralError);

app.listen(PORT, () => {
  // Если всё работает, консоль покажет, какой порт приложение слушает
  console.log(`App listening on port ${PORT}`);
});
