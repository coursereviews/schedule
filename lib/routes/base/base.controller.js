'use strict';

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
  req.validate('email', 'Email is not valid').isEmail();
  req.validate('password', 'Password must be at least 4 characters long').notEmpty();
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
      return res.redirect('/login');
    }
    req.logIn(user, function(err) {
      if (err) {
        return next(err);
      }

      res.redirect('/account');
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
  req.validate('email', 'Email is not valid').isEmail();
  req.validate('password', 'Password must be at least 4 characters long').len(4);
  req.validate('confirmPassword', 'Passwords do not match').equals(req.body.password);

  var errors = req.validationErrors();

  if (errors) {
    req.flash('errors', errors);
    return res.redirect('/signup');
  }

  var user = new User({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
  });

  User.findOne({
    email: req.body.email,
  }, function(err, existingUser) {
    if (existingUser) {
      req.flash('errors', {
        msg: 'Account with that email address already exists.',
      });
      return res.redirect('/signup');
    }
    user.save(function(err) {
      if (err) {
        return next(err);
      }
      req.logIn(user, function(err) {
        if (err) {
          return next(err);
        }
        res.redirect('/');
      });
    });
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
