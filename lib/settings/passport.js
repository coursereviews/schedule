var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var User = require('../models/user');


passport.serializeUser(function(user, done) {
  done(null, user.username);
});

passport.deserializeUser(function(username, done) {
  new User({
    username: username
  }).fetch().then(function(user) {
    done(null, user);
  });
});


/**
 * Sign in using Email and Password.
 */
passport.use(new LocalStrategy({
  usernameField: 'email',
}, function(email, password, done) {
  email = email.toLowerCase();
  new User({
    username: username
  }).fetch().then(function(data) {
    var user = data;
    if (user === null) {
      return done(null, false, {
        message: 'Invalid username or password'
      });
    } else {
      user = data.toJSON();
      if (!bcrypt.compareSync(password, user.password)) {
        return done(null, false, {
          message: 'Invalid username or password'
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
exports.isAuthenticated = function(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
};
