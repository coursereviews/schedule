'use strict';

const Bookshelf = require('../settings/db');
require('./course');
require('./professor');
require('./term');
require('./schedule');
require('./requirement');
require('./meeting');

const CourseOffering = bookshelf.Model.extend({
  tableName: 'course_offering',

  course: function() {
    return this.belongsTo('Course');
  },

  term: function() {
    return this.belongsTo('Term');
  },

  professors: function() {
    return this.belongsToMany('Professor', 'course_offering_professor');
  },

  schedules: function() {
    return this.belongsToMany('Schedule', 'course_offering_schedule');
  },

  requirements: function() {
    return this.belongsToMany('Requirement', 'course_offering_requirement');
  },

  meetings: function() {
    return this.hasMany('Meeting');
  }
});

module.exports = Bookshelf.model('CourseOffering', CourseOffering);
