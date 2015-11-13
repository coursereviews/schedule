'use strict';

const bcrypt = require('bcrypt');
const passport = require('passport');

const User = require('../../models/user');


/**
 * GET /
 * Home page.
 */
exports.index = function(req, res) {
  res.render('index');
};


/**
 * GET /login
 * Login page.
 */
exports.getLogin = function(req, res) {
  if (req.user) {
    return res.redirect('/');
  }
  res.render('login');
};



/**
 * POST /login
 * Sign in using email and password.
 */
exports.postLogin = function(req, res, next) {
  req.validate('username', 'Email is not valid').isEmail();
  req.validate('password', 'Password must be at least 4 characters long').notEmpty();
  var errors = req.validationErrors();

  console.log(errors);

  if (errors) {
    return;
  }

  passport.authenticate('local', {
    successRedirect: '/account',
    failureRedirect: '/login'
  }, function(err, user, info) {
    if (err) {
      return res.render('login', {
        title: 'Sign In',
        errorMessage: err.message
      });
    }

    if (!user) {
      return res.render('login', {
        title: 'Sign In',
        errorMessage: info.message
      });
    }
    return req.logIn(user, function(err) {
      if (err) {
        return res.render('login', {
          title: 'Sign In',
          errorMessage: err.message
        });
      } else {
        return res.redirect('/account');
      }
    });
  })(req, res, next);
};


/**
 * GET /logout
 * Log out.
 */
exports.logout = function(req, res) {
  req.logout();
  res.redirect('/');
};

/**
 * GET /signup
 * Signup page.
 */
exports.getSignup = function(req, res) {
  if (req.user) {
    return res.redirect('/');
  }
  res.render('signup');
};

/**
 * POST /signup
 * Create a new local account.
 */
exports.postSignup = function(req, res, next) {
  req.validate('name', 'Email is not valid').notEmpty();
  req.validate('username', 'Email is not valid').isEmail();
  req.validate('password', 'Password must be at least 4 characters long').len(4);
  req.validate('confirmPassword', 'Passwords do not match').equals(req.body.password);

  // var errors = req.validationErrors();

  var user = new User({
    name: req.body.name,
    username: req.body.username,
    password: req.body.password
  }).fetch();

  return user.then(function(model) {
    if (model) {
      res.render('signup', {
        title: 'signup',
        errorMessage: 'username already exists'
      });
    } else {
      var password = user.password;
      var hash = bcrypt.hashSync(password);

      var signupUser = new User({
        username: user.username,
        password: hash
      });

      signupUser.save().then(function(model) {
        res.redirect('/account');
      });
    }
  });
};
