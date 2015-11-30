'use strict';

const Bookshelf = require('../settings/db');
require('./department');
require('./courseoffering');

const Course = Bookshelf.Model.extend({
  tableName: 'course',

  department: function() {
    return this.belongsTo('Department');
  },

  courseOfferings: function() {
    return this.hasMany('CourseOffering');
  }
});

module.exports = Bookshelf.model('Course', Course);
