var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
const bodyParser = require('body-parser')
var logger = require('morgan');
var compression = require('compression');
var connectMongo = require('connect-mongo');
var flash = require('connect-flash');
var methodOverride = require('method-override');
var mongoose = require('mongoose');
var session = require('express-session');
var passport = require('passport');
const moment = require('moment');
const nunjucks = require('nunjucks');

const expressNunjucks = require('express-nunjucks');
var MongoStore = connectMongo(session);
var app = express();
const isDev = app.get('env') === 'development';

if (isDev) {
  require('dotenv').config()
}

var indexRouter = require('./routes/index');
// var apiRouter = require('./routes/api');

const njk = expressNunjucks(app, {
  watch: isDev,
  noCache: isDev
});

var env = nunjucks.configure(app.get('views'), {
  autoescape: true,
  express: app
});

mongoose.connect('mongodb://localhost/node-auth', function (err) {
  if (err) {
    console.log('Mongoose error:', err);
  }
});

app.use(compression());

app.use(bodyParser.urlencoded({ extended: true }))

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  store: new MongoStore({
    url: 'mongodb://localhost/node-auth'
  }),
  secret: 'sas9989343344glklfgklf',
  saveUninitialized: true,
  resave: true
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

app.use(methodOverride('_method'));

app.use(function (req, res, next) {
  res.locals.user = req.user;
  // res.locals.appUrl = process.env.APP_URL;
  res.locals.login = req.isAuthenticated();
  next();
});

app.use('/', indexRouter);
// app.use('/api', apiRouter);

app.use(function(req, res, next) {
  next(createError(404));
});

app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
