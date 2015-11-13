'use strict';

const Bookshelf = require('../settings/db');
require('./courseoffering');

const Requirement = Bookshelf.Model.extend({
  tableName: 'requirement',

  courseOfferings: function() {
    return this.belongsToMany('CourseOffering', 'course_offering_requirement');
  }
});

module.exports = Bookshelf.model('Requirement', Requirement);
