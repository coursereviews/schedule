var app = app || {};

(function() {
  'use strict';

  var CourseModel = Backbone.Model.extend({
    defaults: {
      title: '',
      code: '',
      instructor: '',
      department: '',
      location: '',
      requirements: [],
      term: '',
      type: '',
      schedule: '',
      end_time: '',
    }
  });

  app.CourseModel = CourseModel;

})();
