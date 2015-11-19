'use strict';

const Bookshelf = require('../settings/db');
require('./course');

const Department = Bookshelf.Model.extend({
  tableName: 'department',

  courses: function() {
    return this.hasMany('Course');
  }
});

module.exports = Bookshelf.model('Department', Department);
