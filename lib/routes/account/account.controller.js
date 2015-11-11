'use strict';

const passport = require('passport');


/**
 * GET /
 * Home page.
 */
exports.index = function(req, res) {
  console.log('account');
  res.render('account');
};
