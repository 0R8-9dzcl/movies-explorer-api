const { NODE_ENV, JWT_SECRET } = process.env;
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user'); // импорт схемы
// импорт ошибок
const BadReqError = require('../errors/BadReqError');
const NotFoundError = require('../errors/NotFoundError');
const ConflictError = require('../errors/ConflictError');

module.exports.createUser = (req, res, next) => {
  const {
    email,
    password,
    name,
  } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      email,
      password: hash,
      name,
    })
      .then((user) => {
        res.status(201).send({
          data: {
            email: user.email,
            name: user.name,
          },
        });
      })
    // данные не записались, вернём ошибку
      .catch((err) => {
        if (err.name === 'ValidationError') next(new BadReqError('Переданы некорректные данные при создании пользователя'));
        if (err.code === 11000) next(new ConflictError('Пользователь с таким адресом электроной почты уже зарегистрирован!'));
        next(err);
      }));
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  User.findUserByCredentials(email, password)
    .then((user) => {
      // аутентификация успешна! пользователь в переменной user
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
        { expiresIn: '7d' },
      );
      res.cookie('jwt', token, {
        maxAge: 3600000 * 24 * 7,
        httpOnly: true,
        sameSite: 'none',
        secure: true,
      })
        .status(200)
        .send({
          data: {
            email: user.email,
            name: user.name,
          },
        });
    })
    .catch(next);
};

module.exports.logout = (req, res) => {
  res.clearCookie('jwt', {
    httpOnly: true,
    sameSite: 'none',
    secure: true,
  })
    .status(200)
    .send({ message: 'Выход выполнен' });
};

module.exports.getUser = (req, res, next) => {
  User.findById(req.user._id, {})
    .then((user) => res.status(200).send({ data: user }))
    .catch(next);
};

module.exports.patchUser = (req, res, next) => {
  const { email, name } = req.body;
  User.findByIdAndUpdate(req.user._id, { email, name }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь по указанному _id не найден');
      }
      return res.status(200).send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') next(new BadReqError('Переданы некорректные данные при обновлении данных пользователя'));
      if (err.name === 'CastError') next(new BadReqError('Переданы некорректные данные при обновлении данных пользователя'));
      next(err);
    });
};
