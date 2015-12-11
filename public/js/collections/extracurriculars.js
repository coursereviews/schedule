var app = app || {};

(function() {
  'use strict';

  var ExtraCurriculars = Backbone.Collection.extend({
    url: '/api/extracurricular',

    model: app.ExtraCurricular
  });

  app.extracurriculars = new ExtraCurriculars();
})();
