require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const { errors } = require('celebrate'); // валидатор запросов
const cookieParser = require('cookie-parser');
const cors = require('cors'); // импорт CORS
const { default: helmet } = require('helmet'); // достаём шлем из чулана
const apiRequestLimiter = require('./middlewares/apiRequestLimiter'); // импорт лимитера
const corsOptions = require('./utils/corsOptions');
const devConfig = require('./utils/devConfig');
const routes = require('./routes/index');
const { requestLogger, errorLogger } = require('./middlewares/logger'); // импорт логов
const centralError = require('./middlewares/centralError'); // централизованный обработчик ошибок

const { PORT = 3000, NODE_ENV, DB_URL } = process.env;
// подключение к базе данных
mongoose.connect(NODE_ENV === 'production' ? DB_URL : devConfig.dbUrl);

const app = express();

app.use(requestLogger); // подключаем логгер запросов
app.use(apiRequestLimiter);
// Надеваем шлем
app.use(helmet());
// включаю корс
app.use(cors(corsOptions));
// подключаю парсеры
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// подключаю роутинг
app.use(routes);

// обработчики ошибок
app.use(errorLogger); // подключаем логгер ошибок
app.use(errors()); // обработчик ошибок celebrate
// Централизованная обработка ошибок
app.use(centralError);

app.listen(PORT, () => {
  // Если всё работает, консоль покажет, какой порт приложение слушает
  console.log(`App listening on port ${PORT}`);
});
