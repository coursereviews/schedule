var app = app || {};

(function() {
  'use strict';

  app.models.Schedule = Backbone.Model.extend({
    defaults: {
      start_time: '',
      end_time: '',
      start_date: '',
      end_date: '',
      days: []
    }
  });

})();
