require('dotenv').config();

// Register models + auth strategy
require('./app_api/models/user');
require('./app_api/config/passport');

const passport = require('passport');
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

// Disable the old Travlr frontend router
// var indexRouter = require('./app_server/routes/index');
var usersRouter = require('./app_server/routes/users');
const apiRouter = require('./app_api/routes');
const errorHandler = require('./app_api/middleware/errorHandler');


var app = express();

//require('./models/db');
require('./app_api/models/db');

// view engine setup: changed to app_server/views directory
app.set('views', path.join(__dirname, 'app_server/views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(passport.initialize()); // Initialize Passport middleware
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


// Disable the old Travlr frontend home page route
// app.use('/', indexRouter); 

// Keep your API and User routes active
app.use('/users', usersRouter);
app.use('/api', apiRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// Centralized error handler — handles JWT, Mongoose, and general errors
app.use(errorHandler);

module.exports = app;
