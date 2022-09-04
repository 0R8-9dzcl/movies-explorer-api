const whitelist = [
  'https://movies.explorer.nomoredomains.sbs',
  'http://movies.explorer.nomoredomains.sbs',
  // 'http://localhost:3000',
];

module.exports.corsOptions = {
  origin(origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
};
