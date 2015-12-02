var schedule = schedule || {};

(function() {
  'use strict';

  schedule.Schedule = Backbone.Model.extend({
    defaults: {
      start_time: '',
      end_time: '',
      start_date: '',
      end_date: '',
      days: []
    }
  });

})();
