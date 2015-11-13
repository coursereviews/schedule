'use strict';

const Bookshelf = require('../settings/db');
require('./schedule');

const User = bookshelf.Model.extend({
  tableName: 'schedule_user',

  hasTimestamps: true,

  schedules: function() {
    return this.hasMany('Schedule');
  }
});

module.exports = Bookshelf.model('User', User);
