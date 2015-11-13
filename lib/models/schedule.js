'use strict';

const Bookshelf = require('../settings/db');
require('./user');
require('./term');
require('./courseoffering');
require('./extracurricular');

const Schedule = Bookshelf.Model.extend({
  tableName: 'schedule',

  hasTimestamps: true,

  user: function() {
    return this.belongsTo('User');
  },

  term: function() {
    return this.belongsTo('Term');
  },

  courseOfferings: function() {
    return this.belongsToMany('CourseOffering', 'course_offering_schedule');
  },

  extraCurriculars: function() {
    return this.belongsToMany('ExtraCurricular', 'schedule_extra_curricular');
  }
});

module.exports = Bookshelf.model('Schedule', Schedule);
