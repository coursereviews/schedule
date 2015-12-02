'use strict';

const Bookshelf = require('../settings/db');
require('./department');
require('./courseoffering');
require('./user');

//todo:delete this?
//require('./favorite');

const Course = Bookshelf.Model.extend({
  tableName: 'course',

  department: function() {
    return this.belongsTo('Department');
  },

  courseOfferings: function() {
    return this.hasMany('CourseOffering');
  },
  favorites: function(){
    return this.belongsToMany('User', 'favorite');
  }
});

module.exports = Bookshelf.model('Course', Course);
