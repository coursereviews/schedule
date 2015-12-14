var app = app || {};

(function() {
  'use strict';

  app.CourseModel = Backbone.Model.extend({
    defaults: {
      title: '',
      code: '',
      instructor: '',
      description: '',
      location: '',
      schedule: '',
      requirements: [],
      crn: '',
      href: ''
    }
  });

})();
