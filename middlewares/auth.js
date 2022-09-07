const { NODE_ENV, JWT_SECRET } = process.env;
const jwt = require('jsonwebtoken');
const devConfig = require('../utils/devConfig');
const AuthError = require('../errors/AuthError');
const { auth } = require('../utils/errMess');

module.exports = (req, res, next) => {
  // тут вся авторизация
  const token = req.cookies.jwt;
  if (!token) {
    throw new AuthError(auth.needAuth);
  }
  let payload;
  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : devConfig.jwt);
  } catch (err) {
    throw new AuthError(auth.needAuth);
  }
  req.user = payload; // записываем пейлоуд в объект запроса
  next(); // пропускаем запрос дальше
};
