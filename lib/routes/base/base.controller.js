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
const postLogin = exports.postLogin = function(req, res, next) {
  req.validate('email', 'Email is not valid').isEmail();
  req.validate('password', 'Password must be at least 4 characters long').notEmpty();
  var errors = req.validationErrors();

  if (errors) {
    return errors;
  }

  passport.authenticate('local', {
    successRedirect: '/account',
    failureRedirect: '/login'
  }, function(err, user, info) {
    if (err) {
      return res.render('login');
    }

    if (!user) {
      console.log('no user found', info);
      return res.render('login');
    }

    return req.logIn(user, function(err) {
      if (err) {
        console.log(err);
        return res.render('login');
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
    return res.redirect('/account');
  }
  res.render('signup');
};

/**
 * POST /signup
 * Create a new local account.
 */
exports.postSignup = function(req, res, next) {
  req.validate('name', 'Email is not valid').notEmpty();
  req.validate('email', 'Email is not valid').isEmail();
  req.validate('password', 'Password must be at least 4 characters long').len(4);

  // var errors = req.validationErrors();

  const user = req.body;
  const testUser = new User(user).fetch();

  return testUser.then(function(model) {
    if (model) {
      console.log('email already exists');
      res.render('signup');
    } else {
      var hash = bcrypt.hashSync(user.password, 10);

      var newUser = new User({
        name: user.name,
        email: user.email,
        password: hash
      });

      newUser.save().then(function(model) {
        postLogin(res, req, next);
      }).catch(function(err) {
        console.log(err);
      });
    }
  });
};

/**
 * GET /forgot
 * Login page.
 */
exports.getForgot = function(req, res) {
  if (req.user) {
    return res.redirect('/');
  }
  res.render('forgot');
};



/**
 * POST /forgot
 * Sign in using email and password.
 */
exports.postForgot = function(req, res, next) {
  req.validate('email', 'Email is not valid').isEmail();
  var errors = req.validationErrors();

  console.log(errors);

  if (errors) {
    return;
  }

  passport.authenticate('local', function(err, user, info) {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.redirect('/forgot');
    }
    req.logIn(user, function(err) {
      if (err) {
        return next(err);
      }

      res.redirect('/account');
    });
  })(req, res, next);
};
