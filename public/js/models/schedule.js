var app = app || {};

(function() {
  'use strict';

  app.ScheduleModel = Backbone.Model.extend({
    defaults: {
      start_time: '',
      end_time: '',
      start_date: '',
      end_date: '',
      days: []
    },
    toJSON: function() {
      var json = Backbone.Model.prototype.toJSON.call(this);
      return json;
    }
  });

})();
