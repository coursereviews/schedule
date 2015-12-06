var app = app || {};

(function() {
  'use strict';

  app.CourseModel = Backbone.Model.extend({
    defaults: {
      title: '',
      code: '',
      instructor: '',
      department: '',
      location: '',
      requirements: [],
      term: '',
      type: '',
      schedule: ''
    }
  });

})();
