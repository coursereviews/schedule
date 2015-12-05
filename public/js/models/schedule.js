var app = app || {};

(function() {
  'use strict';

  var ScheduleModel = Backbone.Model.extend({
    defaults: {
      start_time: '',
      end_time: '',
      start_date: '',
      end_date: '',
      days: []
    }
  });

  app.ScheduleModel = ScheduleModel;

})();
