'use strict';

const Bookshelf = require('../settings/db');
require('../models/courseoffering');

const Term = Bookshelf.Model.extend({
  tableName: 'term',

  courseOfferings: function() {
    return this.hasMany('CourseOffering');
  }
});

module.exports = Bookshelf.model('Term', Term);
