var app = app || {};

(function() {
  'use strict';

  app.models.ExtraCurricular = Backbone.Model.extend({
    defaults: {
      start_time: '',
      end_time: '',
      start_date: '',
      end_date: '',
      days: []
    }
  });

})();
