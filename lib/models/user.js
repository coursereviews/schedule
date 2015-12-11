/* global -Promise */

'use strict';

const Bookshelf = require('../settings/db');
require('./schedule');

const User = Bookshelf.Model.extend({
  tableName: 'schedule_user',

  hasTimestamps: true,

  hidden: ['created_at', 'updated_at'],

  schedules: function() {
    return this.hasMany('Schedule');
  },

  favorites: function() {
    return this.belongsToMany('Course', 'favorite');
  },

  extraCurriculars: function() {
    return this.hasMany('ExtraCurricular');
  }
});

module.exports = Bookshelf.model('User', User);
