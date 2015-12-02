var app = app || {};

(function() {
  'use strict';

  var ExtraCurriculars = Backbone.Collection.extend({
    model: app.ExtraCurricular
  });

  app.collections.extracurriculars = new ExtraCurriculars();
})();
