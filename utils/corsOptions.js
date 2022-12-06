const whitelist = [
  'https://movies.explorer.nomoredomains.sbs',
  'http://movies.explorer.nomoredomains.sbs',
  'http://localhost:3001',
];
const corsOptions = {
  credentials: true,
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,',
  optionsSuccessStatus: 204,
};
module.exports = (req, callback) => {
  if (whitelist.indexOf(req.header('Origin')) !== -1) {
    corsOptions.origin = true; // reflect (enable) the requested origin in the CORS response
  } else {
    corsOptions.origin = false; // disable CORS for this request
  }
  callback(null, corsOptions); // callback expects two parameters: error and options
};
