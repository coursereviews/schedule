const bcrypt = require('bcrypt');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var User = require('../models/user');


passport.serializeUser(function(user, done) {
  done(null, user.toJSON());
});

passport.deserializeUser(function(data, done) {
  done(null, new User(data));
});


/**
 * Sign in using Email and Password.
 */
passport.use(new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
}, function(email, password, done) {
  email = email.toLowerCase();
  new User({
    email: email
  }).fetch().then(function(data) {
    var user = data;
    if (user === null) {
      return done(null, false, {
        message: 'Invalid email or password'
      });
    } else {
      if (!bcrypt.compareSync(password, data.toJSON().password)) {
        return done(null, false, {
          message: 'Invalid email or password'
        });
      } else {
        return done(null, user);
      }
    }
  });
}));


/**
 * Login Required middleware.
 */
exports.requireAuth = function(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
};
