var app = app || {};

(function() {
  'use strict';

  var CourseOfferings = Backbone.Collection.extend({
    model: Backbone.Model
  });

  app.courseOfferings = new CourseOfferings();
})();
