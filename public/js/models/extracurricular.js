var app = app || {};

(function() {
  'use strict';

  var ExtraCurricularModel = Backbone.Model.extend({
    defaults: {
      start_time: '',
      end_time: '',
      start_date: '',
      end_date: '',
      days: []
    }
  });

  app.ExtraCurricularModel = ExtraCurricularModel;
})();
