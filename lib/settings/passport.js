const bcrypt = require('bcrypt');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var User = require('../models/user');


passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});


/**
 * Sign in using Email and Password.
 */
passport.use(new LocalStrategy({
  usernameField: 'email',
  passowrdField: 'password',
}, function(email, password, done) {
  email = email.toLowerCase();
  console.log(email);
  new User({
    email: email
  }).fetch().then(function(data) {
    console.log(data);
    var user = data;
    if (user === null) {
      return done(null, false, {
        message: 'Invalid email or password'
      });
    } else {
      user = data.toJSON();
      if (!bcrypt.compareSync(password, user.password)) {
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
