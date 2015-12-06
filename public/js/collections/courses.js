var app = app || {};

(function() {
  'use strict';

  app.CourseCollection = Backbone.Collection.extend({
    model: app.CourseModel,
    url: '/courses',
  });

})();
