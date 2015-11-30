'use strict';

const bcrypt = require('bcrypt');
const Promise = require('bluebird');
const Bookshelf = require('../settings/db');
require('./schedule');

const User = Bookshelf.Model.extend({
  tableName: 'schedule_user',

  hasTimestamps: true,

  schedules: function() {
    return this.hasMany('Schedule');
  }
}, {
  validatePassword: Promise.method(function(email, password) {
    if (!email || !password) {
      throw new Error('Email and password are both required');
    }
    return new this({
      email: email.toLowerCase().trim()
    }).fetch({
      require: true
    }).tap(function(customer) {
      return bcrypt.compareAsync(customer.get('password'), password)
        .then(function(res) {
          if (!res) {
            throw new Error('Invalid password');
          }
        });
    });
  })
});

module.exports = Bookshelf.model('User', User);
