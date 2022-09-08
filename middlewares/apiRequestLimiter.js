const rateLimit = require('express-rate-limit');
const TooManyRequests = require('../errors/TooManyRequests');
const errMess = require('../utils/errMess');

module.exports = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 минута
  max: 6, // ограничить 6 запросами
  handler: (req, res, next) => next(new TooManyRequests(errMess.tooMany.requests)),
});
