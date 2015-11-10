'use strict';

/**
 * Get list of users
 * restriction: 'admin'
 */
exports.index = function(req, res) {

};

/**
 * Creates a new user
 */
exports.create = function(req, res, next) {

};

/**
 * Get a single user
 */
exports.show = function(req, res, next) {

};

/**
 * Deletes a user
 * restriction: 'admin'
 */
exports.destroy = function(req, res) {

};

/**
 * Change a users password
 */
exports.changePassword = function(req, res, next) {

};

/**
 * Get my info
 */
exports.me = function(req, res, next) {

};

/**
 * Authentication callback
 */
exports.authCallback = function(req, res, next) {
  res.redirect('/');
};
