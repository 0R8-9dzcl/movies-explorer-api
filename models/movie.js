const mongoose = require('mongoose');
const validator = require('validator/');

const movieSchema = new mongoose.Schema({
  country: {
    required: true,
    type: String,
  },
  director: {
    required: true,
    type: String,
  },
  duration: {
    required: true,
    type: Number,
  },
  year: {
    required: true,
    type: Number,
  },
  description: {
    required: true,
    type: String,
  },
  image: {
    required: true,
    type: String,
  },
  trailerLink: {
    required: true,
    type: String,
    validator: (link) => validator.isURL(link),
  },
  thumbnail: {
    required: true,
    type: String,
    validator: (link) => validator.isURL(link),
  },
  owner: {
    type: mongoose.ObjectId,
    ref: 'user',
    required: true,
  },
  movieId: {
    type: Number,
    required: true,
  },
  nameRU: {
    required: true,
    type: String,
  },
  nameEN: {
    required: true,
    type: String,
  },
}, { versionKey: false });

module.exports = mongoose.model('movie', movieSchema);
