'use strict';
var adminService = require('../services/admin');

var passport = require('passport');
var passportLocal = require('passport-local');

var LocalStrategy = passportLocal.Strategy;

var verifyEmailAndPassword = function (email, password, done) {
  adminService.findByEmailAndPassword(email, password, function (err, user) {
    if (err) {
      return done(err);
    }
    
    if (!user) {
      return done(null, false, {message: 'Email ou Mot de Passe Incorrect.'});
    }

    return done(null, user);
  });
};

passport.use(new LocalStrategy(
  {usernameField: 'email', passwordField: 'password'},
  verifyEmailAndPassword
));

passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(function (id, done) {
  adminService.findById(id, done);
});

exports.postLogin = function (req, res, next) {
  return passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
  })(req, res, next);
};

exports.logout = function (req, res) {
  if (req.isAuthenticated()) {
    req.logout();
    res.redirect('/');
  }
};
