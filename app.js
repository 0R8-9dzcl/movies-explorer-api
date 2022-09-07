require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const { errors } = require('celebrate'); // валидатор запросов
const cookieParser = require('cookie-parser');
const cors = require('cors'); // импорт CORS
const { default: helmet } = require('helmet'); // достаём шлем из чулана
const corsOptions = require('./utils/corsOptions');
const devConfig = require('./utils/devConfig');
const auth = require('./middlewares/auth');
const router = require('./routes/index');
const { login, createUser, logout } = require('./controllers/usersContoller');
const NotFoundError = require('./errors/NotFoundError');
const { requestLogger, errorLogger } = require('./middlewares/logger'); // импорт логов
const centralError = require('./middlewares/centralError'); // централизованный обработчик ошибок
// импорт валидаторов
const {
  createUserValidator,
  loginUserValidator,
} = require('./validator/validator');
const errMess = require('./utils/errMess');

const { PORT = 3000, NODE_ENV, DB_URL } = process.env;
// подключение к базе данных
mongoose.connect(NODE_ENV === 'production' ? DB_URL : devConfig.dbUrl);

const app = express();
// включаю корс
app.use(helmet());
// подключаю парсеры
app.use(cors(corsOptions));
// Надеваем шлем
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(requestLogger); // подключаем логгер запросов
// роуты неавторизованого пользователя
app.post('/signin', loginUserValidator, login);
app.post('/signup', createUserValidator, createUser);
// Защита авторизацией
app.use(auth);
// подключаю роутинг
app.use('/', router);
app.post('/signout', logout);
app.use('*', (req, res, next) => {
  next(new NotFoundError(errMess.notFound.url));
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
