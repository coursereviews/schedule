var app = app || {};

(function() {
  'use strict';

  var CourseCollection = Backbone.Collection.extend({
    model: app.CourseModel,
  });

  app.CourseCollection = new CourseCollection();
})();
