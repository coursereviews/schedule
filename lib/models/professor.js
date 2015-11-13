'use strict';

const Bookshelf = require('../settings/db');
require('./courseoffering');

const Professor = Bookshelf.Model.extend({
  tableName: 'professor',

  courseOfferings: function() {
    return this.belongsToMany('CourseOffering');
  }
});

module.exports = Bookshelf.model('Professor', Professor);
