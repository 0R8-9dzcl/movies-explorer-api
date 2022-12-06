module.exports = {
  notFound: {
    url: 'Запрашиваемый ресурс не найден',
    movieById: 'Фильм с указанным id не найден',
    userById: 'Пользователь по указанному _id не найден',
  },
  badReq: {
    createMovie: 'Переданы некорректные данные при создании фильма',
    movieDelete: 'Переданы некорректные данные при удалении фильма',
    registerUser: 'Переданы некорректные данные при создании пользователя',
    updateUser: 'Переданы некорректные данные при обновлении данных пользователя',
  },
  forbid: {
    notOwn: 'Фильм добавлен другим пользователем',
  },
  conflict: {
    email: 'Пользователь с таким адресом электроной почты уже зарегистрирован!',
  },
  auth: {
    needAuth: 'Необходима авторизация',
    incorrectData: 'Неправильные почта или пароль',
  },
  tooMany: {
    requests: 'Слишком много запросов',
  },
  server: {
    error: 'На сервере произошла ошибка',
  },
  notValid: {
    email: 'Неправильный формат почты',
    url: 'Неправильный формат ссылки',
  },
};
