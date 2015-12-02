var schedule = schedule || {};

(function() {
  'use strict';

  schedule.ExtraCurricular = Backbone.Model.extend({
    defaults: {
      start_time: '',
      end_time: '',
      start_date: '',
      end_date: '',
      days: []
    }
  });

})();
