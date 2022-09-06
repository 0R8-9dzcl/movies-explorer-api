const express = require('express');
const usersRouter = require('./usersRouter');
const moviesRouter = require('./moviesRouter');

const app = express();
module.exports = app.use(moviesRouter, usersRouter);
