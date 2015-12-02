var schedule = schedule || {};

(function() {
  'use strict';

  var ExtraCurriculars = Backbone.Collection.extend({
    model: schedule.ExtraCurricular
  });

  schedule.extracurriculars = new ExtraCurriculars();
})();
