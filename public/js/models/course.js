var app = app || {};

(function() {
  'use strict';


  var CourseModel = Backbone.Model.extend({
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

  app.CourseModel = CourseModel;

})();
