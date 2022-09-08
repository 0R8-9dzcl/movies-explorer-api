const { NODE_ENV, JWT_SECRET, SALT } = process.env;
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user'); // импорт схемы
const devConfig = require('../utils/devConfig');
// импорт ошибок
const BadReqError = require('../errors/BadReqError');
const NotFoundError = require('../errors/NotFoundError');
const ConflictError = require('../errors/ConflictError');
const errMess = require('../utils/errMess');

module.exports.createUser = (req, res, next) => {
  const {
    email,
    password,
    name,
  } = req.body;
  bcrypt.hash(password, NODE_ENV === 'production' ? Number(SALT) : devConfig.devSalt)
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
        if (err.name === 'ValidationError') next(new BadReqError(errMess.badReq.registerUser));
        if (err.code === 11000) next(new ConflictError(errMess.conflict.email));
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
        NODE_ENV === 'production' ? JWT_SECRET : devConfig.jwt,
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
        throw new NotFoundError(errMess.notFound.userById);
      }
      return res.status(200).send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') next(new BadReqError(errMess.badReq.updateUser));
      if (err.name === 'CastError') next(new BadReqError(errMess.badReq.updateUser));
      next(err);
    });
};
