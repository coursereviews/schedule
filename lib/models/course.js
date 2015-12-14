'use strict';

const Bookshelf = require('../settings/db');
const _ = require('lodash');
require('./department');
require('./courseoffering');

const Course = Bookshelf.Model.extend({
  tableName: 'course',

  department: function() {
    return this.belongsTo('Department');
  },

  courseOfferings: function() {
    return this.hasMany('CourseOffering');
  },

  /* Async serialize method that serializes a course with an additional
   * 'favorited' attribute, indicating whether the user in the request
   * context has favorited this course.
   */
  serializeWithFavorited: function(options) {
    var serialized = this.toJSON(options);

    return options.user.fetch({withRelated: ['favorites']})
    .then(function(user) {
      var favorites = user.related('favorites')
        .map(function(course) {
          return course.get('id');
        });

      serialized.favorited = _.contains(favorites, serialized.id);

      return serialized;
    });
  }
});

module.exports = Bookshelf.model('Course', Course);
