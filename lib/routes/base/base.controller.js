'use strict';

const bcrypt = require('bcrypt');
const moment = require('moment');

const User = require('../../models/user');


/**
 * GET /
 * Home page.
 */
exports.index = function(req, res) {
  const randomDate = '2015-12-12 ';
  const startTime = moment(randomDate + '08:00');
  const endTime = randomDate + '22:30';
  let $scheduleTimes = [];

  for (; startTime.isBefore(endTime); startTime.add(30, 'minutes')) {
    let $interval = '';
    if (startTime.minute() / 30 !== 1) {
      $interval = startTime.format('h:mm');
    }
    $scheduleTimes.push($interval);
  }

  res.render('index', {
    days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
    timeArray: $scheduleTimes
  });
};

/**
 * GET /settings
 * Settings page.
 */
exports.settings = function(req, res) {
  res.render('settings');
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
 * GET /logout
 * Log out.
 */
exports.logout = function(req, res) {
  req.logout();
  res.redirect('/login');
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
 * GET /search
 * Search page.
 */
exports.getSearch = function(req, res) {
  if (req.user) {
    return res.redirect('/');
  }
  res.render('search');
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
  const testUser = new User({
    email: user.email,
    password: user.password
  }).fetch();

  return testUser.then(function(model) {
    if (model) {
      console.log('email already exists');
      res.redirect('/signup');
    } else {
      var hash = bcrypt.hashSync(user.password, 10);

      var newUser = new User({
        name: user.name,
        email: user.email,
        password: hash
      });

      newUser.save().then(function(model) {
        req.login(newUser, function(err) {
          if (err) {
            return next(err);
          }
          res.redirect('/');
        });
      }).catch(function(err) {
        return next(err);
      });
    }
  });
};
